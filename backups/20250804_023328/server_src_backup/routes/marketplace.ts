import express from 'express';
import { 
  searchProducts, 
  getCart, 
  addToCart, 
  createOrder, 
  getDashboardStats 
} from '../controllers/marketplaceController';
import { validateAddToCart, validateCreateOrder } from '../middleware/validation';
import { apiLimiter, cartLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.use(apiLimiter);

router.get('/products/search', searchProducts);
router.get('/cart', getCart);
router.post('/cart/add', cartLimiter, validateAddToCart, addToCart);
router.post('/orders', validateCreateOrder, createOrder);
router.get('/analytics/dashboard', getDashboardStats);

export default router;
