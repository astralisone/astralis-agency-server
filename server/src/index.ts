import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PrismaClient } from '@prisma/client';
import contactRoutes from './routes/contact.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import marketplaceRoutes from './routes/marketplace.js';
import testimonialsRoutes from './routes/testimonials.js';
import adminRoutes from './routes/admin.js';

// Enhanced routes
import enhancedMarketplaceRoutes from './routes/enhanced/marketplace.js';
import ssrRoutes from './routes/enhanced/ssr.js';
import fullSSRRoutes from './routes/enhanced/full-ssr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Verify the DATABASE_URL is loaded
console.log('Database URL:', process.env.DATABASE_URL);

// Test database connection with Prisma
prisma.$connect()
  .then(() => console.log('Connected to PostgreSQL via Prisma'))
  .catch((error) => console.error('Prisma connection error:', error));

// Middleware - Enhanced CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (Enhanced routes first to avoid conflicts)
app.use('/api/marketplace/enhanced', enhancedMarketplaceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  res.send(healthcheck);
});

// SEO and SSR routes (MUST be before static files and catch-all)
app.use('/', fullSSRRoutes); // Full SSR for all main routes
app.use('/', ssrRoutes); // Legacy SSR for specific routes (sitemap, robots, product pages)

// Serve static files from the React app (but not for SSR routes)
app.use(express.static(path.join(__dirname, '../../build'), {
  index: false // Don't serve index.html automatically
}));

// Fallback to client/dist if build doesn't exist
app.use(express.static(path.join(__dirname, '../../client/dist'), {
  index: false // Don't serve index.html automatically
}));

// Handle React routing - ONLY for non-SSR routes
app.get('*', (req, res, next) => {
  // Skip SSR routes - comprehensive list of routes that have SSR
  const ssrRoutes = [
    '/',
    '/marketplace',
    '/blog',
    '/contact',
    '/login',
    '/register',
    '/checkout',
    '/sitemap.xml',
    '/robots.txt'
  ];
  
  // Check if this is an exact match or a dynamic route
  if (ssrRoutes.includes(req.path) ||
      req.path.startsWith('/marketplace/product/') ||
      req.path.match(/^\/marketplace\/[^\/]+$/) || // /marketplace/:slug
      req.path.startsWith('/blog/')) {
    return next();
  }
  
  // Try build directory first
  const buildIndexPath = path.join(__dirname, '../../build/index.html');
  const clientIndexPath = path.join(__dirname, '../../client/dist/index.html');
  
  if (fs.existsSync(buildIndexPath)) {
    res.sendFile(buildIndexPath);
  } else if (fs.existsSync(clientIndexPath)) {
    res.sendFile(clientIndexPath);
  } else {
    res.status(404).send('Application not found');
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown with Prisma
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await prisma.$disconnect();
    console.log('Database connections closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
