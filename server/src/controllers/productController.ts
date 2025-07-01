import { Request, Response } from 'express';
import { Product } from '../models/Product.js';

export const productController = {
  // Create a new product
  async create(req: Request, res: Response) {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({ error: 'Failed to create product' });
    }
  },

  // Get all products
  async getAll(req: Request, res: Response) {
    try {
      const products = await Product.findAll();
      return res.json(products);
    } catch (error) {
      console.error('Get all products error:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  // Get a single product by ID
  async getById(req: Request, res: Response) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(product);
    } catch (error) {
      console.error('Get product by ID error:', error);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  // Update a product
  async update(req: Request, res: Response) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const updatedProduct = await Product.update(req.params.id, req.body);
      return res.json(updatedProduct);
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(500).json({ error: 'Failed to update product' });
    }
  },

  // Delete a product
  async delete(req: Request, res: Response) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      await Product.destroy({ where: { id: req.params.id } });
      return res.status(204).send();
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  }
};
