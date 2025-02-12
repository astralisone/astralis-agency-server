import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { Sequelize } from 'sequelize';
import contactRoutes from './routes/contact';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  ssl: process.env.NODE_ENV === 'production',
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((error) => console.error('PostgreSQL connection error:', error));

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  res.send(healthcheck);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 