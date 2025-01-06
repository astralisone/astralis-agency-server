import { Router } from 'express';
import authRoutes from './auth';
import contactRoutes from './contact';
import resourcesRoutes from './resources';

const router = Router();

router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/resources', resourcesRoutes);

export { router };