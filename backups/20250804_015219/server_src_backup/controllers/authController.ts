import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { generateToken } from '../middleware/auth';
import bcrypt from 'bcrypt';
import { getErrorMessage } from '../utils/error-handler';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // Default role
      },
    });

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token (exclude password)
    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token (exclude password)
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // User is already attached to request by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.status(200).json({
      status: 'success',
      data: req.user,
    });
  } catch (error: unknown) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

// Create admin user (for development/testing)
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // Verify secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ message: 'Invalid secret key' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token (exclude password)
    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error: unknown) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: getErrorMessage(error) });
  }
};
