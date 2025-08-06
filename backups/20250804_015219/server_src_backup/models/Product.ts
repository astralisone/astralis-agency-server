import prisma from '../lib/prisma.js';

interface ProductAttributes {
  id: number;
  type: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  image: string;
  tax: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  // Find all products
  static async findAll(options?: { where?: any }) {
    return prisma.marketplaceItem.findMany({
      where: options?.where || {},
    });
  }

  // Find a product by ID
  static async findByPk(id: string) {
    return prisma.marketplaceItem.findUnique({
      where: { id },
    });
  }

  // Create a new product
  static async create(data: {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    sellerId: string;
    status?: 'AVAILABLE' | 'SOLD_OUT' | 'COMING_SOON';
    specifications?: any;
    features?: string[];
    stock?: number;
    discountPrice?: number;
  }) {
    return prisma.marketplaceItem.create({
      data: {
        title: data.title,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        sellerId: data.sellerId,
        status: data.status || 'AVAILABLE',
        specifications: data.specifications || {},
        features: data.features || [],
        stock: data.stock || 0,
        discountPrice: data.discountPrice || null,
      },
    });
  }

  // Update a product
  static async update(id: string, data: any) {
    return prisma.marketplaceItem.update({
      where: { id },
      data,
    });
  }

  // Delete a product
  static async destroy({ where }: { where: { id: string } }) {
    return prisma.marketplaceItem.delete({
      where: { id: where.id },
    });
  }
}

export default Product;
