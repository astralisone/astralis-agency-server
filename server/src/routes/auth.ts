import express from 'express';
import { register, login, getCurrentUser, createAdmin } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user route (protected)
router.get('/me', authenticate, getCurrentUser);

// Create admin user route (for development/testing)
router.post('/create-admin', createAdmin);

export default router; 