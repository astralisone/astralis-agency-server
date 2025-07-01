import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import prisma from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Create a sample user to be the seller
async function createSampleUser() {
  const user = await prisma.user.upsert({
    where: { email: 'seller@astralis.one' },
    update: {},
    create: {
      email: 'seller@astralis.one',
      name: 'Sample Seller',
      password: '$2b$10$dJoCrMJtCGIjXBm1gBsZ8eUGYVXcv9l7oeWA3AUUeR3nUxO5z5JMK', // hashed version of 'password123'
      role: 'USER'
    }
  });
  return user;
}

// Create a sample category
async function createSampleCategory() {
  const category = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories'
    }
  });
  return category;
}

const productSeedData = [
  {
    title: 'Premium Smartphone',
    description: 'Latest model smartphone with advanced features and high-performance capabilities.',
    price: 999.99,
    imageUrl: '/images/products/smartphone-full.jpg',
    status: 'AVAILABLE',
    stock: 10,
    features: ['5G Connectivity', 'High-resolution camera', 'All-day battery life']
  },
  {
    title: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
    price: 199.99,
    imageUrl: '/images/products/earbuds-full.jpg',
    status: 'AVAILABLE',
    stock: 20,
    features: ['Noise cancellation', 'Waterproof', '24-hour battery life']
  },
  {
    title: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring and notifications.',
    price: 299.99,
    imageUrl: '/images/products/smartwatch-full.jpg',
    status: 'AVAILABLE',
    stock: 15,
    features: ['Heart rate monitor', 'Sleep tracking', 'GPS']
  },
  {
    title: 'Leather Phone Case',
    description: 'Premium leather phone case with card slots and superior protection.',
    price: 49.99,
    imageUrl: '/images/products/case-full.jpg',
    status: 'AVAILABLE',
    stock: 50,
    features: ['Genuine leather', 'Card slots', 'Drop protection']
  },
  {
    title: '4K Smart TV',
    description: '65-inch 4K Smart TV with HDR and built-in streaming services.',
    price: 1499.99,
    imageUrl: '/images/products/tv-full.jpg',
    status: 'AVAILABLE',
    stock: 5,
    features: ['4K resolution', 'HDR', 'Smart TV features']
  }
];

async function seedDatabase() {
  try {
    console.log('Creating sample user and category...');
    const seller = await createSampleUser();
    const category = await createSampleCategory();
    
    console.log('Clearing existing products...');
    await prisma.marketplaceItem.deleteMany({});
    
    console.log('Seeding products...');
    for (const product of productSeedData) {
      await prisma.marketplaceItem.create({
        data: {
          title: product.title,
          slug: product.title.toLowerCase().replace(/\s+/g, '-'),
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          status: product.status as any,
          stock: product.stock,
          features: product.features,
          seller: {
            connect: { id: seller.id }
          },
          category: {
            connect: { id: category.id }
          }
        }
      });
    }
    
    console.log('Database seeded successfully!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Add this to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

seedDatabase();
