import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Sequelize } from 'sequelize';
import pkg from 'pg';
const { Client } = pkg;
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function setupDatabase() {
  console.log('Starting database setup...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Connection details:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
    url: process.env.DATABASE_URL?.replace(/:([^:@]{1,})@/, ':***@'), // Mask password
  });

  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    console.log('Attempting to connect to PostgreSQL...');
    await client.connect();
    console.log('Connected successfully to PostgreSQL');
    
    // Check if database exists
    console.log(`Checking if database "${process.env.DB_NAME}" exists...`);
    const dbExists = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME]
    );

    if (dbExists.rows.length === 0) {
      console.log(`Creating database ${process.env.DB_NAME}...`);
      try {
        await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log('Database created successfully');
      } catch (error) {
        console.error('Error creating database:', error);
        throw error;
      }
    } else {
      console.log('Database already exists');
    }

    await client.end();
    console.log('Closed initial postgres connection');

    // Connect with Sequelize
    console.log('Connecting to database with Sequelize...');
    const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
      dialect: 'postgres',
      logging: (msg) => console.log('Sequelize:', msg),
      retry: {
        max: 3,
        timeout: 3000
      }
    });

    try {
      await sequelize.authenticate();
      console.log('Sequelize connection authenticated');

      console.log('Syncing Product model...');
      await Product.sync({ force: true });
      console.log('Product model synced');

      await sequelize.close();
      console.log('Database setup completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Sequelize error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Setup failed:', error);
    if (client) {
      console.log('Attempting to close postgres client...');
      await client.end().catch(err => console.error('Error closing client:', err));
    }
    process.exit(1);
  }
}

// Add this to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

setupDatabase(); 