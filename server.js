// This file serves as an entry point for the application
// It imports and uses the server from server/dist/index.js

// Import required modules
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
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

// Import routes from server/dist
import authRoutes from './server/dist/routes/auth.js';
import contactRoutes from './server/dist/routes/contact.js';
import productRoutes from './server/dist/routes/products.js';
import healthRoutes from './server/dist/routes/health.js';

// Register API routes first
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/health', healthRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      database: {
        connected: true,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        name: process.env.DB_NAME || 'astralis'
      },
      env: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      uptime: process.uptime(),
      message: 'ERROR',
      timestamp: Date.now(),
      database: {
        connected: false,
        error: error.message
      },
      env: process.env.NODE_ENV || 'development'
    });
  }
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
const buildPath = path.join(__dirname, 'client/dist');
app.use(express.static(buildPath));

// Handle React routing, return all requests to React app
// This should be AFTER all API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
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