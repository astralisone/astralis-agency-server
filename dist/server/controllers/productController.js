import { Product } from '../models/Product';
export const productController = {
    // Create a new product
    async create(req, res) {
        try {
            const product = await Product.create(req.body);
            return res.status(201).json(product);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to create product' });
        }
    },
    // Get all products
    async getAll(req, res) {
        try {
            const products = await Product.findAll();
            return res.json(products);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
    },
    // Get a single product by ID
    async getById(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(product);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
    },
    // Update a product
    async update(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await product.update(req.body);
            return res.json(product);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to update product' });
        }
    },
    // Delete a product
    async delete(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await product.destroy();
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to delete product' });
        }
    }
};
