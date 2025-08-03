import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { prisma } from '../config/database';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function createAdminUser() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Connected to database via Prisma');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@astralis.one',
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('45tr4l15', 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@astralis.one',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created successfully:');
    console.log({
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    });

    console.log('\nYou can now login with:');
    console.log('Email: admin@astralis.one');
    console.log('Password: 45tr4l15');
    console.log('\nIMPORTANT: Change this password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close database connection
    await prisma.$disconnect();
  }
}

// Run the function
createAdminUser();
