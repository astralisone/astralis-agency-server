import express from 'express';
import { authenticate as authenticateJWT, isAdmin as authorizeAdmin } from '../middleware/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { Request } from 'express';
import { ParsedQs } from 'qs';

interface TypedRequestQuery extends Request {
  query: {
    limit?: string;
    page?: string;
    search?: string;
    role?: string;
    sortBy?: string;
    order?: string;
  }
}

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to ensure all admin routes are protected
router.use(authenticateJWT, authorizeAdmin);

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      usersCount,
      postsCount,
      marketplaceItemsCount,
      testimonialCount,
      recentUsers,
      recentPosts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.marketplaceItem.count(),
      prisma.testimonial.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: true,
          tags: true,
        },
      }),
    ]);

    res.json({
      status: 'success',
      data: {
        counts: {
          users: usersCount,
          posts: postsCount,
          marketplaceItems: marketplaceItemsCount,
          testimonials: testimonialCount,
        },
        recentUsers,
        recentPosts,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin dashboard stats',
    });
  }
});

// Get all users (admin only)
router.get('/users', async (req: TypedRequestQuery, res) => {
  try {
    const { limit = '10', page = '1', search, role, sortBy = 'createdAt', order = 'desc' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: Prisma.UserWhereInput = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role) {
      where.role = role as 'USER' | 'AUTHOR' | 'EDITOR' | 'ADMIN';
    }

    // Build orderBy
    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sortBy]: order.toLowerCase() as Prisma.SortOrder
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
              marketplaceItems: true,
              testimonials: true,
            },
          },
        },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasNextPage: skip + users.length < total,
          hasPrevPage: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
});

// Get a single user by ID (admin only)
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            marketplaceItems: true,
            testimonials: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'success', data: user });
  } catch (error) {
    console.error('Error fetching user:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ status: 'error', message: 'Failed to fetch user' });
  }
});

// Update a user (admin only)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, avatar } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    // Check if email already exists (excluding current user)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Email already in use' 
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
        role: role !== undefined ? (role as 'USER' | 'AUTHOR' | 'EDITOR' | 'ADMIN') : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    // Prevent deleting the last admin
    if (existingUser.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Cannot delete the last admin user' 
        });
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 