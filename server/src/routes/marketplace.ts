import express from 'express';
import { authenticate as authenticateJWT, isAdmin as authorizeAdmin } from '../middleware/auth';
import { PrismaClient, Prisma, ItemStatus } from '@prisma/client';
import { Request } from 'express';
import { ParsedQs } from 'qs';
import { formatErrorResponse, ErrorResponse, createNotFoundError, getErrorMessage } from '../utils/error-handler';

interface TypedRequestQuery extends Request {
  query: {
    limit?: string;
    page?: string;
    search?: string;
    category?: string;
    status?: ItemStatus;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    order?: string;
  }
}

interface SuccessResponse<T> {
  status: 'success';
  data: T;
}

const router = express.Router();
const prisma = new PrismaClient();

// Get all marketplace items with pagination and filtering
router.get('/', async (req: TypedRequestQuery, res) => {
  try {
    const {
      limit = '10',
      page = '1',
      search,
      category,
      status,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: Prisma.MarketplaceItemWhereInput = {
      published: true,
    };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = { slug: category };
    }

    if (status) {
      where.status = status;
    }

    // Handle price filtering
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = new Prisma.Decimal(minPrice);
      if (maxPrice) where.price.lte = new Prisma.Decimal(maxPrice);
    }

    // Build orderBy
    const orderBy: Prisma.MarketplaceItemOrderByWithRelationInput = {
      [sortBy]: order.toLowerCase() as Prisma.SortOrder
    };

    const [items, total] = await Promise.all([
      prisma.marketplaceItem.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          price: true,
          imageUrl: true,
          status: true,
          specifications: true,
          features: true,
          stock: true,
          discountPrice: true,
          weight: true,
          dimensions: true,
          featured: true,
          createdAt: true,
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
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
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.marketplaceItem.count({ where }),
    ]);

    const response: SuccessResponse<{
      items: typeof items;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }> = {
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
    };

    res.json(response);
  } catch (error: unknown) {
    res.status(500).json(formatErrorResponse(error, 'Failed to fetch marketplace items'));
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

// Create a new marketplace item
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      categoryId,
      sellerId,
      specifications,
      features,
      stock,
      discountPrice,
      weight,
      dimensions,
      featured,
      tags = [],
    } = req.body;

    // Generate a slug from the title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const item = await prisma.marketplaceItem.create({
      data: {
        title,
        slug,
        description,
        price: new Prisma.Decimal(price),
        imageUrl,
        seller: {
          connect: { id: sellerId },
        },
        category: {
          connect: { id: categoryId },
        },
        specifications,
        features,
        stock,
        discountPrice: discountPrice ? new Prisma.Decimal(discountPrice) : null,
        weight: weight ? new Prisma.Decimal(weight) : null,
        dimensions,
        featured,
        tags: {
          connect: tags.map((id: string) => ({ id })),
        },
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    const response: SuccessResponse<typeof item> = {
      status: 'success',
      data: item,
    };

    res.status(201).json(response);
  } catch (error: unknown) {
    res.status(500).json(formatErrorResponse(error, 'Failed to create marketplace item'));
  }
});

// Update a marketplace item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      imageUrl,
      categoryId,
      specifications,
      features,
      stock,
      discountPrice,
      weight,
      dimensions,
      featured,
      tags = [],
    } = req.body;

    // Check if item exists
    const existingItem = await prisma.marketplaceItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json(createNotFoundError('Marketplace item', id));
    }

    // Generate a new slug if title is updated
    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined;

    const updatedItem = await prisma.marketplaceItem.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        price: price ? new Prisma.Decimal(price) : undefined,
        imageUrl,
        category: categoryId ? {
          connect: { id: categoryId },
        } : undefined,
        specifications,
        features,
        stock,
        discountPrice: discountPrice ? new Prisma.Decimal(discountPrice) : undefined,
        weight: weight ? new Prisma.Decimal(weight) : undefined,
        dimensions,
        featured,
        tags: {
          set: tags.map((id: string) => ({ id })),
        },
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    const response: SuccessResponse<typeof updatedItem> = {
      status: 'success',
      data: updatedItem,
    };

    res.json(response);
  } catch (error: unknown) {
    res.status(500).json(formatErrorResponse(error, 'Failed to update marketplace item'));
  }
});

// Delete a marketplace item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const existingItem = await prisma.marketplaceItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json(createNotFoundError('Marketplace item', id));
    }

    await prisma.marketplaceItem.delete({
      where: { id },
    });

    const response: SuccessResponse<{ message: string }> = {
      status: 'success',
      data: { message: 'Marketplace item deleted successfully' },
    };

    res.json(response);
  } catch (error: unknown) {
    res.status(500).json(formatErrorResponse(error, 'Failed to delete marketplace item'));
  }
});

// Get marketplace categories
router.get('/categories', async (req, res) => {
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
    });

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      itemsCount: category._count.marketplaceItems,
    }));

    const response: SuccessResponse<typeof formattedCategories> = {
      status: 'success',
      data: formattedCategories,
    };

    res.json(response);
  } catch (error: unknown) {
    res.status(500).json(formatErrorResponse(error, 'Failed to fetch marketplace categories'));
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
  } catch (error: unknown) {
    console.error('Error creating marketplace category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create marketplace category',
      error: getErrorMessage(error)
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
  } catch (error: unknown) {
    console.error('Error updating marketplace category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update marketplace category',
      error: getErrorMessage(error)
    });
  }
});

router.delete('/categories/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
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

    await prisma.category.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Error deleting marketplace category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete marketplace category',
      error: getErrorMessage(error)
    });
  }
});

// Get marketplace tags
router.get('/tags', async (req, res) => {
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
    });

    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      itemsCount: tag._count.marketplaceItems,
    }));

    const response: SuccessResponse<typeof formattedTags> = {
      status: 'success',
      data: formattedTags,
    };

    res.json(response);
  } catch (error: unknown) {
    res.status(500).json(formatErrorResponse(error, 'Failed to fetch marketplace tags'));
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
  } catch (error: unknown) {
    console.error('Error creating marketplace tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create marketplace tag',
      error: getErrorMessage(error)
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
  } catch (error: unknown) {
    console.error('Error updating marketplace tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update marketplace tag',
      error: getErrorMessage(error)
    });
  }
});

router.delete('/tags/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
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

    await prisma.tag.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'Tag deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Error deleting marketplace tag:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete marketplace tag',
      error: getErrorMessage(error)
    });
  }
});

export default router; 