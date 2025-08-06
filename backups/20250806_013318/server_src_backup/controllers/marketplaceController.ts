import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const {
      q, category, minPrice, maxPrice, sortBy = 'createdAt', 
      sortOrder = 'desc', page = 1, limit = 20, inStock = false, featured = false
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { status: 'AVAILABLE', published: true };

    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } }
      ];
    }

    if (category) where.categoryId = Number(category);
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (inStock === 'true') where.stock = { gt: 0 };
    if (featured === 'true') where.featured = true;

    const [products, total] = await Promise.all([
      prisma.marketplaceItem.findMany({
        where,
        include: {
          category: true,
          seller: { select: { id: true, name: true, avatar: true } }
        },
        orderBy: { [sortBy as string]: sortOrder },
        skip,
        take: Number(limit)
      }),
      prisma.marketplaceItem.count({ where })
    ]);

    res.json({
      status: 'success',
      data: {
        items: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
          hasPrevPage: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (userId) {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true, image: true, quantity: true, status: true }
              }
            }
          }
        }
      });
      res.json(cart || { items: [], subtotal: 0, total: 0 });
    } else {
      const sessionCart = (req as any).session?.cart || { items: [], subtotal: 0, total: 0 };
      res.json(sessionCart);
    }
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = (req as any).user?.id;

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });

    if (!product || product.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Product not found or unavailable' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    if (userId) {
      const cart = await prisma.cart.upsert({
        where: { userId },
        create: {
          userId,
          items: {
            create: {
              productId: Number(productId),
              quantity: Number(quantity),
              price: product.price
            }
          }
        },
        update: {},
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true, image: true }
              }
            }
          }
        }
      });
      res.json(cart);
    } else {
      if (!(req as any).session.cart) {
        (req as any).session.cart = { items: [], subtotal: 0, total: 0 };
      }

      (req as any).session.cart.items.push({
        productId: Number(productId),
        quantity: Number(quantity),
        price: product.price,
        productName: product.name
      });

      (req as any).session.cart.subtotal = (req as any).session.cart.items.reduce(
        (sum: number, item: any) => sum + (item.price * item.quantity), 0
      );
      (req as any).session.cart.total = (req as any).session.cart.subtotal;

      res.json((req as any).session.cart);
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;
    const userId = (req as any).user?.id;

    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }
    }

    const subtotal = items.reduce((sum: number, item: any) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product!.price * item.quantity);
    }, 0);

    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PENDING',
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress,
          billingAddress,
          paymentMethod,
          notes,
          items: {
            create: items.map((item: any) => {
              const product = products.find(p => p.id === item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product!.price,
                total: product!.price * item.quantity
              };
            })
          }
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, image: true, sku: true }
              }
            }
          }
        }
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } }
        });
      }

      return newOrder;
    });

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Order creation failed' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query;
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const whereClause = { createdAt: { gte: startDate } };

    const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
      prisma.order.count({ where: whereClause }),
      prisma.order.aggregate({
        where: { ...whereClause, status: { not: 'CANCELLED' } },
        _sum: { total: true }
      }),
      prisma.order.count({ where: { ...whereClause, status: 'PENDING' } })
    ]);

    res.json({
      metrics: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders
      },
      period
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

export const getMarketplaceCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            marketplaceItems: true,
          },
        },
      },
    });

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      _count: {
        marketplaceItems: category._count.marketplaceItems,
      },
    }));

    res.json({
      status: 'success',
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Marketplace categories error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch categories' });
  }
};

export const getMarketplaceTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            marketplaceItems: true,
          },
        },
      },
    });

    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      _count: {
        marketplaceItems: tag._count.marketplaceItems,
      },
    }));

    res.json({
      status: 'success',
      data: formattedTags,
    });
  } catch (error) {
    console.error('Marketplace tags error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch tags' });
  }
};
