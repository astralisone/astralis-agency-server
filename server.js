const express = require('express');
const path = require('path');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

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

app.get('/api/blog', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
        },
        include: {
          author: {
            select: {
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
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.post.count({
        where: {
          status: 'PUBLISHED',
        },
      }),
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

app.get('/api/marketplace/categories', async (req, res) => {
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