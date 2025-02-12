import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Generate a secure random password
const generatePassword = () => {
  const length = 24;
  return crypto.randomBytes(length).toString('base64');
};

async function setupDatabase() {
  try {
    const dbName = 'astralis_portal';
    const adminUsername = 'astralisadmin';
    const adminPassword = generatePassword();

    // Connect to default postgres database first
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_ADMIN_USER || 'postgres',
      password: process.env.DB_ADMIN_PASSWORD,
      database: 'postgres',
      logging: false,
    });

    // Create database if it doesn't exist
    await sequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${dbName}') THEN
          CREATE DATABASE ${dbName};
        END IF;
      END $$;
    `);

    // Connect to the new database
    const dbSequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_ADMIN_USER || 'postgres',
      password: process.env.DB_ADMIN_PASSWORD,
      database: dbName,
      logging: false,
    });

    // Create user and grant privileges
    await dbSequelize.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '${adminUsername}') THEN
          CREATE USER ${adminUsername} WITH PASSWORD '${adminPassword}';
        ELSE
          ALTER USER ${adminUsername} WITH PASSWORD '${adminPassword}';
        END IF;
      END $$;
    `);

    await dbSequelize.query(`
      GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${adminUsername};
    `);

    // Create tables
    await dbSequelize.query(`
      CREATE TABLE IF NOT EXISTS contact_forms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_contact_forms_email ON contact_forms(email);
      CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON contact_forms(status);
      CREATE INDEX IF NOT EXISTS idx_contact_forms_submitted_at ON contact_forms(submitted_at);
    `);

    console.log('\n=== Database Setup Complete ===');
    console.log('Admin Username:', adminUsername);
    console.log('Admin Password:', adminPassword);
    console.log('\nIMPORTANT: Save these credentials securely!');
    console.log('\nUpdate your .env file with the following DATABASE_URL:');
    console.log(`DATABASE_URL=postgres://${adminUsername}:${adminPassword}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${dbName}`);

    await sequelize.close();
    await dbSequelize.close();

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 