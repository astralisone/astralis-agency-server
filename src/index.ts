import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { formRouter } from './routes/form';
import { marketplaceRouter } from './routes/marketplace';
import { blogRouter } from './routes/blog';
import { errorHandler } from './middleware/error';

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/submit-form', formRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/blog', blogRouter);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 