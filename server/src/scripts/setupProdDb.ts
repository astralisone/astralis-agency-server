import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

async function setupProductionDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });

    // Create tables
    await sequelize.query(`
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

    console.log('Production database setup completed successfully');
    await sequelize.close();

  } catch (error) {
    console.error('Production database setup failed:', error);
    process.exit(1);
  }
}

setupProductionDatabase(); 