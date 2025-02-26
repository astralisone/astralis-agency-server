// This file serves as an entry point for the application
// It imports and uses the server from server/src/index.ts

// Import required modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the server
import('./server/src/index.js')
  .then(module => {
    console.log('Server imported successfully');
    // The server is already started in the imported module
  })
  .catch(error => {
    console.error('Failed to import server:', error);
    process.exit(1);
  }); 