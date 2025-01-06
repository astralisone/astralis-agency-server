import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as apiRouter } from './routes';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});