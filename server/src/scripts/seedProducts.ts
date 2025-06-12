import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Product } from '../models/Product';
import { sequelize } from '../config/database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const productSeedData = [
  {
    type: 'electronics',
    title: 'Premium Smartphone',
    description: 'Latest model smartphone with advanced features and high-performance capabilities.',
    price: 999.99,
    thumbnail: '/images/products/smartphone-thumb.jpg',
    image: '/images/products/smartphone-full.jpg',
    tax: 20.00
  },
  {
    type: 'electronics',
    title: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
    price: 199.99,
    thumbnail: '/images/products/earbuds-thumb.jpg',
    image: '/images/products/earbuds-full.jpg',
    tax: 10.00
  },
  {
    type: 'accessories',
    title: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring and notifications.',
    price: 299.99,
    thumbnail: '/images/products/smartwatch-thumb.jpg',
    image: '/images/products/smartwatch-full.jpg',
    tax: 15.00
  },
  {
    type: 'accessories',
    title: 'Leather Phone Case',
    description: 'Premium leather phone case with card slots and superior protection.',
    price: 49.99,
    thumbnail: '/images/products/case-thumb.jpg',
    image: '/images/products/case-full.jpg',
    tax: 5.00
  },
  {
    type: 'electronics',
    title: '4K Smart TV',
    description: '65-inch 4K Smart TV with HDR and built-in streaming services.',
    price: 1499.99,
    thumbnail: '/images/products/tv-thumb.jpg',
    image: '/images/products/tv-full.jpg',
    tax: 30.00
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Syncing Product model...');
    await Product.sync({ force: true }); // This will drop the table if it exists
    
    console.log('Seeding products...');
    await Product.bulkCreate(productSeedData);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Add this to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

seedDatabase(); 