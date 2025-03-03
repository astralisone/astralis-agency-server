// This file serves as an entry point for the application
// It imports and uses the server from server/src/index.ts using ts-node

// Import required modules
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import express from 'express';
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
app.use(express.urlencoded({ extended: true }));

// Import route files - using TypeScript files directly from src
import authRoutes from './server/src/routes/auth';
import contactRoutes from './server/src/routes/contact';
import healthRoutes from './server/src/routes/health';
import testimonialRoutes from './server/src/routes/testimonials';
import blogRoutes from './server/src/routes/blog';
import marketplaceRoutes from './server/src/routes/marketplace';
import adminRoutes from './server/src/routes/admin';

// Register API routes first
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  });
});

// Serve static files from the React app
const buildPath = join(__dirname, 'client/dist');
app.use(express.static(buildPath));

// Handle React routing, return all requests to React app
// This should be AFTER all API routes
app.get('*', (req, res) => {
  res.sendFile(join(buildPath, 'index.html'));
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