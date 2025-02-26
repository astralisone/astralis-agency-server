// This file serves as an entry point for the application
// It imports and uses the server from server/dist/index.js

// Import required modules
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000; // Use PORT from .env or default to 4000

// Enable CORS for all routes
app.use(cors());  // Simplified CORS configuration

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import route files
import authRoutes from './server/src/routes/auth.js';
import productRoutes from './server/src/routes/products.js';
import contactRoutes from './server/src/routes/contact.js';
import healthRoutes from './server/src/routes/health.js';
import testimonialRoutes from './server/src/routes/testimonials.js';
import blogRoutes from './server/src/routes/blog.js';
import marketplaceRoutes from './server/src/routes/marketplace.js';
import adminRoutes from './server/src/routes/admin.js';

// Register API routes first
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
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

// Update a marketplace item
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

// Delete a marketplace item
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

// Blog API route
app.get('/api/blog', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search, sortBy = 'publishedAt', order = 'desc' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = {
        slug: category
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        orderBy: {
          [sortBy]: order,
        },
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
          totalPages: Math.ceil(total / Number(limit)),
          hasNextPage: skip + posts.length < total,
          hasPrevPage: Number(page) > 1,
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

// Marketplace categories and tags
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

// Testimonials API route
app.get('/api/testimonials', async (req, res) => {
  try {
    const { featured } = req.query;
    
    const where = {
      published: true,
    };
    
    if (featured === 'true') {
      where.featured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    res.json({
      status: 'success',
      data: testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch testimonials',
    });
  }
});

// Serve static files from the React app
const buildPath = join(__dirname, 'client/dist');
app.use(express.static(buildPath));

// Handle React routing, return all requests to React app
// This should be AFTER all API routes
app.get('*', (req, res) => {
  res.sendFile(join(buildPath, 'index.html'));
});

// Log routes function
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

// Start the server
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

// Export the app for testing
export default app; 