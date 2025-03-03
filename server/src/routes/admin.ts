import express from 'express';
import { authenticate as authenticateJWT, isAdmin as authorizeAdmin } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to ensure all admin routes are protected
router.use(authenticateJWT, authorizeAdmin);

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      usersCount,
      productsCount,
      blogPostsCount,
      marketplaceItemsCount,
      testimonialCount,
      contactMessagesCount,
      recentUsers,
      recentOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.post.count(),
      prisma.marketplaceItem.count(),
      prisma.testimonial.count(),
      prisma.contactMessage.count(),
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
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      }),
    ]);

    res.json({
      status: 'success',
      data: {
        counts: {
          users: usersCount,
          products: productsCount,
          blogPosts: blogPostsCount,
          marketplaceItems: marketplaceItemsCount,
          testimonials: testimonialCount,
          contactMessages: contactMessagesCount,
        },
        recentUsers,
        recentOrders,
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
router.get('/users', async (req, res) => {
  try {
    const { limit = 10, page = 1, search, role, sortBy = 'createdAt', order = 'desc' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role) {
      where.role = role;
    }

    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = order.toLowerCase();

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
              orders: true,
              posts: true,
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
    console.error('Error fetching users:', error);
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
            orders: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'success', data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
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
        role: role !== undefined ? role : undefined,
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
    console.error('Error updating user:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update user',
      error: error.message 
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
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete user',
      error: error.message 
    });
  }
});

// Get all contact messages (admin only)
router.get('/contact-messages', async (req, res) => {
  try {
    const { limit = 10, page = 1, status, sortBy = 'createdAt', order = 'desc' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where = {};
    
    if (status) {
      where.status = status;
    }

    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = order.toLowerCase();

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.contactMessage.count({ where }),
    ]);

    res.json({
      status: 'success',
      data: {
        messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasNextPage: skip + messages.length < total,
          hasPrevPage: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact messages',
    });
  }
});

// Update contact message status (admin only)
router.put('/contact-messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Contact message not found' 
      });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    res.json({
      status: 'success',
      data: updatedMessage,
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update contact message',
      error: error.message 
    });
  }
});

// Delete a contact message (admin only)
router.delete('/contact-messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Contact message not found' 
      });
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    res.json({ 
      status: 'success',
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete contact message',
      error: error.message 
    });
  }
});

export default router; 