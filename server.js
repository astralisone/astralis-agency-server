const express = require('express');
const path = require('path');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); // Make sure dotenv is loaded

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000; // Use PORT from .env or default to 4000

// Enable CORS for all routes
app.use(cors());  // Simplified CORS configuration

app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.get('/api/marketplace', async (req, res) => {
  try {
    const { featured, limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const where = {};
    if (featured === 'true') {
      where.featured = true;
    }

    const [items, total] = await Promise.all([
      prisma.marketplaceItem.findMany({
        where,
        include: {
          category: true,
          seller: {
            select: {
              name: true,
              avatar: true,
            },
          },
          tags: true,
        },
        skip,
        take: Number(limit),
      }),
      prisma.marketplaceItem.count({ where }),
    ]);

    res.json({
      status: 'success',
      data: {
        items,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + items.length < total,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch marketplace items',
    });
  }
});

// Create a new marketplace item
app.post('/api/marketplace', async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      price,
      discountPrice,
      imageUrl,
      categoryId,
      status,
      stock,
      featured,
      published,
      tags,
      features,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !description || !price || !imageUrl || !categoryId || !status) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    // Check if slug already exists
    const existingItem = await prisma.marketplaceItem.findUnique({
      where: { slug },
    });

    if (existingItem) {
      return res.status(409).json({
        status: 'error',
        message: 'An item with this slug already exists',
      });
    }

    // Create the marketplace item
    const newItem = await prisma.marketplaceItem.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        imageUrl,
        status,
        stock: parseInt(stock, 10),
        featured: Boolean(featured),
        published: Boolean(published),
        features: features || [],
        category: {
          connect: { id: categoryId },
        },
        seller: {
          // For now, connect to the first admin user
          // In a real app, this would be the authenticated user
          connect: { id: (await prisma.user.findFirst({ where: { role: 'ADMIN' } })).id },
        },
        ...(tags && tags.length > 0
          ? {
              tags: {
                connect: tags.map((tagId) => ({ id: tagId })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        seller: {
          select: {
            name: true,
            avatar: true,
          },
        },
        tags: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create marketplace item',
    });
  }
});

// Blog routes
app.get('/api/blog', async (req, res) => {
  try {
    const { limit = 10, page = 1, search, category, status, sortBy = 'publishedAt', order = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (status) {
      where.status = status;
    } else {
      // Default to only published posts for public API
      where.status = 'PUBLISHED';
    }

    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = order.toLowerCase();

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      status: 'success',
      data: {
        posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + posts.length < total,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blog posts',
    });
  }
});

// Blog categories routes
app.get('/api/blog/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

app.post('/api/blog/categories', async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Name and slug are required' 
      });
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(400).json({ 
        status: 'error',
        message: 'A category with this slug already exists' 
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
      },
    });

    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create category',
      error: error.message 
    });
  }
});

app.put('/api/blog/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Name and slug are required' 
      });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Category not found' 
      });
    }

    // Check if slug already exists (excluding current category)
    const slugExists = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (slugExists) {
      return res.status(400).json({ 
        status: 'error',
        message: 'A category with this slug already exists' 
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || existingCategory.description || '',
      },
    });

    res.json({
      status: 'success',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update category',
      error: error.message 
    });
  }
});

app.delete('/api/blog/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Category not found' 
      });
    }

    // Check if category is in use by any blog posts
    const postsUsingCategory = await prisma.post.count({
      where: {
        categoryId: id,
      },
    });

    if (postsUsingCategory > 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Cannot delete category that is in use by blog posts',
        data: { postsCount: postsUsingCategory }
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete category',
      error: error.message 
    });
  }
});

// Blog tags routes
app.get('/api/blog/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    res.json({
      status: 'success',
      data: tags.map(tag => ({
        ...tag,
        postsCount: tag._count.posts
      }))
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch tags',
      error: error.message
    });
  }
});

app.post('/api/blog/tags', async (req, res) => {
  try {
    const { name, slug } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Name and slug are required' 
      });
    }

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return res.status(400).json({ 
        status: 'error',
        message: 'A tag with this slug already exists' 
      });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    res.status(201).json({
      status: 'success',
      data: tag
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create tag',
      error: error.message 
    });
  }
});

app.put('/api/blog/tags/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Name and slug are required' 
      });
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Tag not found' 
      });
    }

    // Check if slug already exists (excluding current tag)
    const slugExists = await prisma.tag.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (slugExists) {
      return res.status(400).json({ 
        status: 'error',
        message: 'A tag with this slug already exists' 
      });
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    res.json({
      status: 'success',
      data: updatedTag
    });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update tag',
      error: error.message 
    });
  }
});

app.delete('/api/blog/tags/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Tag not found' 
      });
    }

    // Check if tag is in use by any blog posts
    const postsUsingTag = await prisma.post.count({
      where: {
        tags: {
          some: {
            id,
          },
        },
      },
    });

    if (postsUsingTag > 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Cannot delete tag that is in use by blog posts',
        data: { postsCount: postsUsingTag }
      });
    }

    await prisma.tag.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete tag',
      error: error.message 
    });
  }
});

// Get a single blog post by ID
app.get('/api/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Blog post not found' });
    }

    res.json({ status: 'success', data: post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch blog post' });
  }
});

app.get('/api/marketplace/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            marketplaceItems: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories',
    });
  }
});

app.get('/api/marketplace/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            marketplaceItems: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      status: 'success',
      data: tags,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tags',
    });
  }
});

// Admin stats endpoint
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [marketplaceItems, blogPosts, users] = await Promise.all([
      prisma.marketplaceItem.count(),
      prisma.post.count(),
      prisma.user.count(),
    ]);

    // Calculate total views (in a real app, this would be from analytics)
    const totalViews = await prisma.post.aggregate({
      _sum: {
        viewCount: true,
      },
    });

    res.json({
      status: 'success',
      data: {
        marketplaceItems,
        blogPosts,
        users,
        totalViews: totalViews._sum.viewCount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin stats',
    });
  }
});

// PATCH /api/marketplace/:id - Update a marketplace item
app.patch('/api/marketplace/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      price,
      discountPrice,
      imageUrl,
      categoryId,
      status,
      stock,
      featured,
      published,
      features,
      tags
    } = req.body;

    // Check if item exists
    const existingItem = await prisma.marketplaceItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Marketplace item not found',
      });
    }

    // Check if slug is unique (if changed)
    if (slug !== existingItem.slug) {
      const slugExists = await prisma.marketplaceItem.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(400).json({
          status: 'error',
          message: 'Slug already exists',
        });
      }
    }

    // Update the item
    const updatedItem = await prisma.marketplaceItem.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        price,
        discountPrice,
        imageUrl,
        status,
        stock,
        featured,
        published,
        features,
        category: {
          connect: { id: categoryId },
        },
        tags: {
          set: [], // First disconnect all tags
          connect: tags?.map(tagId => ({ id: tagId })) || [], // Then connect the selected ones
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    res.json({
      status: 'success',
      data: updatedItem,
      message: 'Marketplace item updated successfully',
    });
  } catch (error) {
    console.error('Error updating marketplace item:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update marketplace item',
      error: error.message,
    });
  }
});

// DELETE /api/marketplace/:id - Delete a marketplace item
app.delete('/api/marketplace/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const existingItem = await prisma.marketplaceItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Marketplace item not found',
      });
    }

    // Delete the item
    await prisma.marketplaceItem.delete({
      where: { id },
    });

    res.json({
      status: 'success',
      message: 'Marketplace item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting marketplace item:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete marketplace item',
      error: error.message,
    });
  }
});

// Determine build directory based on environment
const buildPath = process.env.NODE_ENV === 'build' 
  ? path.join(__dirname, '__tests__/mocks/build')
  : path.join(__dirname, 'build');

// Serve static files from the React build directory
app.use(express.static(buildPath));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Function to log all registered routes
const logRoutes = () => {
  console.log('Base local url: http://localhost:'+PORT+"/");
  console.log('Base Prod url: https://astralis.one/.');
  console.log('\nRegistered Routes:');
  console.log('------------------');
  
  // Log static files route
  console.log('Static Files:', buildPath);
  
  // Log all registered routes
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      console.log(`${middleware.route.stack[0].method.toUpperCase()}\t${middleware.route.path}`);
    } else if (middleware.name === 'static') {
      // Static file middleware
      console.log('STATIC\t', middleware.regexp);
    }
  });
  console.log('------------------\n');
};

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    logRoutes();
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using that port.`);
      process.exit(1);
    } else {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  });
}

module.exports = app; 