import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sequelize } from '../config/database.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function createAdminUser() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: {
        email: 'admin@astralis.one',
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@astralis.one',
      password: '45tr4l15', // This will be hashed by the User model hooks
      role: 'ADMIN',
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
    await sequelize.close();
  }
}

// Run the function
createAdminUser(); 