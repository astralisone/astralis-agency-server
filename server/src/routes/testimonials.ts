import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate as authenticateJWT, isAdmin as authorizeAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all published testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        published: true,
      },
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

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
});

// Get featured testimonials
router.get('/featured', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        published: true,
        featured: true,
      },
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

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    res.status(500).json({ message: 'Error fetching featured testimonials' });
  }
});

// Get a single testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await prisma.testimonial.findUnique({
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
      },
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ message: 'Error fetching testimonial' });
  }
});

// Admin routes below

// Create a new testimonial (admin only)
router.post('/', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const { content, rating, authorId, role, company, avatar, featured, published, sortOrder } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        content,
        rating: rating || 5,
        authorId,
        role,
        company,
        avatar,
        featured: featured || false,
        published: published || true,
        sortOrder,
      },
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Error creating testimonial' });
  }
});

// Update a testimonial (admin only)
router.put('/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, rating, authorId, role, company, avatar, featured, published, sortOrder } = req.body;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        content,
        rating,
        authorId,
        role,
        company,
        avatar,
        featured,
        published,
        sortOrder,
      },
    });

    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ message: 'Error updating testimonial' });
  }
});

// Delete a testimonial (admin only)
router.delete('/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'Error deleting testimonial' });
  }
});

export default router; 