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

async function setupProductionDatabase() {
  try {
    console.log('Setting up production database...');
    
    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error('Cannot connect to production database. Please check your DATABASE_URL environment variable.');
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
    
    console.log('Production database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Production database setup failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupProductionDatabase()
    .then((success) => {
      if (success) {
        console.log('Production database setup completed');
        process.exit(0);
      } else {
        console.error('Production database setup failed');
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Unhandled error during production database setup:', err);
      process.exit(1);
    });
}

export default setupProductionDatabase;
