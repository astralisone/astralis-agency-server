import { Product } from '../../models/Product.js';
import { setupTestDb, closeTestDb } from '../utils/testDb';

describe('Product Model', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  afterEach(async () => {
    await Product.destroy({ where: {} });
  });

  // Add the test product data
  const testProduct = {
    type: 'electronics',
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    thumbnail: '/test-thumb.jpg',
    image: '/test-image.jpg',
    tax: 10.00
  };

  it('should create a product successfully', async () => {
    const product = await Product.create(testProduct);
    expect(product.title).toBe(testProduct.title);
    expect(product.price).toBe(testProduct.price);
  });

  it('should not create a product without required fields', async () => {
    // Using Partial type to make all fields optional
    const invalidProduct: Partial<typeof testProduct> = {
      type: 'electronics',
      description: 'Test Description',
      price: 99.99,
      thumbnail: '/test-thumb.jpg',
      image: '/test-image.jpg',
      tax: 10.00
    };

    await expect(Product.create(invalidProduct as any)).rejects.toThrow();
  });
}); 