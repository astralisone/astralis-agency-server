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
  tag: z.string().optional(),
  search: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('PUBLISHED'),
  sortBy: z.enum(['publishedAt', 'title', 'viewCount']).optional().default('publishedAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// GET /api/blog
router.get('/', async (req, res, next) => {
  try {
    const {
      page,
      limit,
      category,
      tag,
      search,
      author,
      status,
      sortBy,
      order,
    } = querySchema.parse(req.query);

    // Build where clause
    const where: any = {
      status,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (author) {
      where.author = {
        id: author,
      };
    }

    // Get total count
    const total = await prisma.post.count({ where });

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
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
        posts,
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

// GET /api/blog/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
            bio: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    res.json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/blog/:slug/comments
router.post('/:slug/comments', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { content, authorId } = req.body;

    // TODO: Add authentication middleware
    if (!authorId) {
      throw new AppError(401, 'Authentication required');
    }

    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        post: {
          connect: { id: post.id },
        },
        author: {
          connect: { id: authorId },
        },
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/blog/:slug/likes
router.post('/:slug/likes', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { userId } = req.body;

    // TODO: Add authentication middleware
    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }

    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    // Check if user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId: post.id,
            userId,
          },
        },
      });
    } else {
      // Like
      await prisma.like.create({
        data: {
          post: {
            connect: { id: post.id },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
    }

    const likeCount = await prisma.like.count({
      where: {
        postId: post.id,
      },
    });

    res.json({
      status: 'success',
      data: {
        liked: !existingLike,
        likeCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/blog/categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            posts: true,
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

// GET /api/blog/tags
router.get('/tags', async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        name: true,
        slug: true,
        _count: {
          select: {
            posts: true,
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

export { router as blogRouter }; 