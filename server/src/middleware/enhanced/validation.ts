import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

export const validateAddToCart = [
  body('itemId').isUUID().withMessage('Valid item ID is required'),
  body('quantity').isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100'),
  handleValidationErrors
];

export const validateCreateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.itemId').isUUID(),
  body('items.*.quantity').isInt({ min: 1, max: 100 }),
  body('shippingAddress.street').trim().isLength({ min: 1 }),
  body('shippingAddress.city').trim().isLength({ min: 1 }),
  body('shippingAddress.zipCode').trim().isLength({ min: 1 }),
  handleValidationErrors
];

export const validateProductSearch = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  handleValidationErrors
];
