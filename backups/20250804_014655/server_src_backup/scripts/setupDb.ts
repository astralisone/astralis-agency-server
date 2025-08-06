import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (error) {
      console.error('Database connection failed:', error);
      console.log('Creating database...');
      
      // Extract database name from DATABASE_URL
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
      }
      
      const dbName = new URL(dbUrl).pathname.substring(1);
      console.log(`Database name: ${dbName}`);
      
      // Create database using psql
      try {
        await execAsync(`createdb ${dbName}`);
        console.log(`Database ${dbName} created successfully`);
      } catch (createError) {
        console.log(`Database ${dbName} might already exist, continuing...`);
      }
    }
    
    // Run migrations
    console.log('Running migrations...');
    try {
      await execAsync('npx prisma migrate deploy');
      console.log('Migrations applied successfully');
    } catch (migrateError) {
      console.error('Error applying migrations:', migrateError);
      throw migrateError;
    }
    
    console.log('Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupDatabase()
    .then((success) => {
      if (success) {
        console.log('Database setup completed');
        process.exit(0);
      } else {
        console.error('Database setup failed');
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Unhandled error during database setup:', err);
      process.exit(1);
    });
}

export default setupDatabase;
