import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error';

const prisma = new PrismaClient();
const router = Router();

// Query parameters schema
const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  status: z.enum(['AVAILABLE', 'SOLD_OUT', 'COMING_SOON']).optional(),
  sortBy: z.enum(['price', 'createdAt', 'title']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// GET /api/marketplace
router.get('/', async (req, res, next) => {
  try {
    const {
      page,
      limit,
      category,
      search,
      minPrice,
      maxPrice,
      status,
      sortBy,
      order,
    } = querySchema.parse(req.query);

    // Build where clause
    const where: any = {
      published: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.marketplaceItem.count({ where });

    // Get items with pagination
    const items = await prisma.marketplaceItem.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        seller: {
          select: {
            name: true,
            avatar: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        [sortBy]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      status: 'success',
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/marketplace/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const item = await prisma.marketplaceItem.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        seller: {
          select: {
            name: true,
            avatar: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!item) {
      throw new AppError(404, 'Item not found');
    }

    res.json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/marketplace/categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
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
    next(error);
  }
});

// GET /api/marketplace/tags
router.get('/tags', async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
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
    next(error);
  }
});

export { router as marketplaceRouter }; 