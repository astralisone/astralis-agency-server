const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
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
    logRoutes();
  });
}

module.exports = app; 