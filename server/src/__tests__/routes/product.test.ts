import request from 'supertest';
import app from '../../index.js';
import { Product } from '../../models/Product.js';
import { setupTestDb, closeTestDb } from '../utils/testDb';

describe('Product API', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  afterEach(async () => {
    await Product.destroy({ where: {} });
  });

  const testProduct = {
    type: 'electronics',
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    thumbnail: '/test-thumb.jpg',
    image: '/test-image.jpg',
    tax: 10.00
  };

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(testProduct);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(testProduct.title);
    });

    it('should return 400 for invalid product data', async () => {
      const invalidProduct: Partial<typeof testProduct> = {
        type: 'electronics',
        description: 'Test Description',
        price: 99.99,
        thumbnail: '/test-thumb.jpg',
        image: '/test-image.jpg',
        tax: 10.00
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      await Product.create(testProduct);

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(1);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      const product = await Product.create(testProduct);

      const response = await request(app)
        .get(`/api/products/${product.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(testProduct.title);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const product = await Product.create(testProduct);
      const updatedData = { ...testProduct, title: 'Updated Title' };

      const response = await request(app)
        .put(`/api/products/${product.id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const product = await Product.create(testProduct);

      const response = await request(app)
        .delete(`/api/products/${product.id}`);

      expect(response.status).toBe(204);

      const deletedProduct = await Product.findByPk(product.id);
      expect(deletedProduct).toBeNull();
    });
  });
}); 