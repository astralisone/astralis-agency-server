import express from 'express';
import { authenticate as authenticateJWT, isAdmin as authorizeAdmin } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all marketplace items
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      order = 'desc' 
    } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (minPrice) {
      where.price = {
        ...where.price,
        gte: Number(minPrice),
      };
    }
    
    if (maxPrice) {
      where.price = {
        ...where.price,
        lte: Number(maxPrice),
      };
    }

    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = order.toLowerCase();

    const [items, total] = await Promise.all([
      prisma.marketplaceItem.findMany({
        where,
        include: {
          category: true,
          tags: true,
        },
        orderBy,
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
          totalPages: Math.ceil(total / Number(limit)),
          hasNextPage: skip + items.length < total,
          hasPrevPage: Number(page) > 1,
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

// Get a single marketplace item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await prisma.marketplaceItem.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Marketplace item not found' });
    }

    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch marketplace item' });
  }
});

// Create a new marketplace item (admin only)
router.post('/', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      salePrice, 
      imageUrl, 
      categoryId, 
      tagIds = [], 
      status = 'ACTIVE',
      features = []
    } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !imageUrl || !categoryId) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Name, description, price, imageUrl, and categoryId are required' 
      });
    }

    // Check if category exists
    const categoryExists = await prisma.marketplaceCategory.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Category not found' 
      });
    }

    // Create the marketplace item
    const item = await prisma.marketplaceItem.create({
      data: {
        name,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        imageUrl,
        status,
        features,
        category: {
          connect: { id: categoryId },
        },
        tags: tagIds.length > 0 ? {
          connect: tagIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create marketplace item',
      error: error.message 
    });
  }
});

// Update a marketplace item (admin only)
router.put('/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      salePrice, 
      imageUrl, 
      categoryId, 
      tagIds, 
      status,
      features
    } = req.body;

    // Check if item exists
    const existingItem = await prisma.marketplaceItem.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });

    if (!existingItem) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Marketplace item not found' 
      });
    }

    // Check if category exists if provided
    if (categoryId) {
      const categoryExists = await prisma.marketplaceCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Category not found' 
        });
      }
    }

    // Prepare update data
    const updateData = {
      name: name !== undefined ? name : undefined,
      description: description !== undefined ? description : undefined,
      price: price !== undefined ? Number(price) : undefined,
      salePrice: salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : undefined,
      imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      status: status !== undefined ? status : undefined,
      features: features !== undefined ? features : undefined,
      category: categoryId ? {
        connect: { id: categoryId },
      } : undefined,
    };

    // Handle tags update if provided
    let tagsUpdate = {};
    if (tagIds !== undefined) {
      // Disconnect all existing tags
      tagsUpdate.disconnect = existingItem.tags.map(tag => ({ id: tag.id }));
      
      // Connect new tags if any
      if (tagIds.length > 0) {
        tagsUpdate.connect = tagIds.map(id => ({ id }));
      }
    }

    // Update the marketplace item
    const updatedItem = await prisma.marketplaceItem.update({
      where: { id },
      data: {
        ...updateData,
        tags: Object.keys(tagsUpdate).length > 0 ? tagsUpdate : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    res.json({
      status: 'success',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating marketplace item:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update marketplace item',
      error: error.message 
    });
  }
});

// Delete a marketplace item (admin only)
router.delete('/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const existingItem = await prisma.marketplaceItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Marketplace item not found' 
      });
    }

    // Delete the marketplace item
    await prisma.marketplaceItem.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'Marketplace item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting marketplace item:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete marketplace item',
      error: error.message 
    });
  }
});

// Marketplace categories routes
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.marketplaceCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            items: true
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
    console.error('Error fetching marketplace categories:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch marketplace categories',
      error: error.message
    });
  }
});

router.post('/categories', authenticateJWT, authorizeAdmin, async (req, res) => {
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
    const existingCategory = await prisma.marketplaceCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(400).json({ 
        status: 'error',
        message: 'A category with this slug already exists' 
      });
    }

    const category = await prisma.marketplaceCategory.create({
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
    console.error('Error creating marketplace category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create marketplace category',
      error: error.message 
    });
  }
});

router.put('/categories/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
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
    const existingCategory = await prisma.marketplaceCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Category not found' 
      });
    }

    // Check if slug already exists (excluding current category)
    const slugExists = await prisma.marketplaceCategory.findFirst({
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

    const updatedCategory = await prisma.marketplaceCategory.update({
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
    console.error('Error updating marketplace category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update marketplace category',
      error: error.message 
    });
  }
});

router.delete('/categories/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await prisma.marketplaceCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Category not found' 
      });
    }

    // Check if category is in use by any marketplace items
    const itemsUsingCategory = await prisma.marketplaceItem.count({
      where: {
        categoryId: id,
      },
    });

    if (itemsUsingCategory > 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Cannot delete category that is in use by marketplace items',
        data: { itemsCount: itemsUsingCategory }
      });
    }

    await prisma.marketplaceCategory.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting marketplace category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete marketplace category',
      error: error.message 
    });
  }
});

// Marketplace tags routes
router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.marketplaceTag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            items: true
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
        itemsCount: tag._count.items
      }))
    });
  } catch (error) {
    console.error('Error fetching marketplace tags:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch marketplace tags',
      error: error.message
    });
  }
});

router.post('/tags', authenticateJWT, authorizeAdmin, async (req, res) => {
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
    const existingTag = await prisma.marketplaceTag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return res.status(400).json({ 
        status: 'error',
        message: 'A tag with this slug already exists' 
      });
    }

    const tag = await prisma.marketplaceTag.create({
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
    console.error('Error creating marketplace tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create marketplace tag',
      error: error.message 
    });
  }
});

router.put('/tags/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
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
    const existingTag = await prisma.marketplaceTag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Tag not found' 
      });
    }

    // Check if slug already exists (excluding current tag)
    const slugExists = await prisma.marketplaceTag.findFirst({
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

    const updatedTag = await prisma.marketplaceTag.update({
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
    console.error('Error updating marketplace tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update marketplace tag',
      error: error.message 
    });
  }
});

router.delete('/tags/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if tag exists
    const existingTag = await prisma.marketplaceTag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Tag not found' 
      });
    }

    // Check if tag is in use by any marketplace items
    const itemsUsingTag = await prisma.marketplaceItem.count({
      where: {
        tags: {
          some: {
            id,
          },
        },
      },
    });

    if (itemsUsingTag > 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Cannot delete tag that is in use by marketplace items',
        data: { itemsCount: itemsUsingTag }
      });
    }

    await prisma.marketplaceTag.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting marketplace tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete marketplace tag',
      error: error.message 
    });
  }
});

export default router; 