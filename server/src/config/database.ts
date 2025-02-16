import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Construct database URL with proper handling of empty password
const constructDbUrl = () => {
  // If DATABASE_URL is provided, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  
  if (!DB_USER || !DB_HOST || !DB_PORT || !DB_NAME) {
    console.error('Missing database configuration:', {
      DB_USER,
      DB_HOST,
      DB_PORT,
      DB_NAME,
      // Don't log password
    });
    throw new Error('Missing required database configuration');
  }

  return DB_PASSWORD 
    ? `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    : `postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
};

const dbUrl = constructDbUrl();

// Log configuration for debugging (mask sensitive data)
console.log('Database Configuration:', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  // Mask password in URL
  CONNECTION_URL: dbUrl.replace(/:([^:@]{1,})@/, ':***@')
});

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: (msg) => console.log('Sequelize:', msg),
  ssl: process.env.NODE_ENV === 'production',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test connection function
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
} 