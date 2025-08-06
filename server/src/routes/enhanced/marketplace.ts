import express from 'express';
import { 
  searchProducts, 
  getCart, 
  addToCart, 
  createOrder, 
  getDashboardStats 
} from '../../controllers/enhanced/marketplaceController.js';
import { 
  validateAddToCart, 
  validateCreateOrder,
  validateProductSearch 
} from '../../middleware/enhanced/validation.js';
import { 
  apiLimiter, 
  cartLimiter, 
  searchLimiter 
} from '../../middleware/enhanced/rateLimiter.js';

const router = express.Router();

// Apply general API rate limiting
router.use(apiLimiter);

// Product search with specific rate limiting
router.get('/products/search', searchLimiter, validateProductSearch, searchProducts);

// Cart operations
router.get('/cart', getCart);
router.post('/cart/add', cartLimiter, validateAddToCart, addToCart);

// Order operations
router.post('/orders', validateCreateOrder, createOrder);

// Analytics (admin only - would need auth middleware)
router.get('/analytics/dashboard', getDashboardStats);

export default router;
