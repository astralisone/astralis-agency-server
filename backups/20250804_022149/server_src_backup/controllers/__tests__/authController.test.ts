import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { register, login, getCurrentUser } from '../authController.js';
import User from '../../models/User.js';
import { generateToken } from '../../middleware/auth.js';

// Mock dependencies
jest.mock('../../models/User');
jest.mock('../../middleware/auth');

// Mock the jsonwebtoken module
jest.mock('jsonwebtoken');

// Mock the bcrypt module
jest.mock('bcrypt');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {
      body: {},
      user: undefined
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return 201 status', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER'
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (generateToken as jest.Mock).mockReturnValue('mock-token');

      // Act
      await register(req as Request, res as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(User.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'USER'
      });
      expect(generateToken).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER',
          token: 'mock-token'
        }
      });
    });

    it('should return 400 if user already exists', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      const existingUser = {
        id: '123',
        name: 'Existing User',
        email: 'existing@example.com',
        role: 'USER'
      };

      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      // Act
      await register(req as Request, res as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'existing@example.com' } });
      expect(User.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login user and return token if credentials are valid', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        validatePassword: jest.fn().mockResolvedValue(true)
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (generateToken as jest.Mock).mockReturnValue('mock-token');

      // Act
      await login(req as Request, res as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockUser.validatePassword).toHaveBeenCalledWith('password123');
      expect(generateToken).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER',
          token: 'mock-token'
        }
      });
    });

    it('should return 401 if user not found', async () => {
      // Arrange
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      await login(req as Request, res as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 401 if password is invalid', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        validatePassword: jest.fn().mockResolvedValue(false)
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await login(req as Request, res as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockUser.validatePassword).toHaveBeenCalledWith('wrongpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      // Arrange
      req.user = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER'
      };

      // Act
      await getCurrentUser(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER'
        }
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      req.user = undefined;

      // Act
      await getCurrentUser(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
    });
  });
}); 