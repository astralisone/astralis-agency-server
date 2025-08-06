import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const {
      q, category, minPrice, maxPrice, sortBy = 'createdAt', 
      sortOrder = 'desc', page = 1, limit = 20, inStock = false
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { status: 'AVAILABLE', published: true };

    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } }
      ];
    }

    if (category) where.categoryId = category as string;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (inStock === 'true') where.stock = { gt: 0 };

    const [items, total] = await Promise.all([
      prisma.marketplaceItem.findMany({
        where,
        include: {
          category: true,
          seller: { select: { id: true, name: true, avatar: true } },
          reviews: {
            select: { rating: true },
            where: { status: 'APPROVED' }
          }
        },
        orderBy: { [sortBy as string]: sortOrder },
        skip,
        take: Number(limit)
      }),
      prisma.marketplaceItem.count({ where })
    ]);

    // Calculate average ratings
    const itemsWithRatings = items.map(item => ({
      ...item,
      averageRating: item.reviews.length > 0 
        ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
        : 0,
      reviewCount: item.reviews.length
    }));

    res.json({
      items: itemsWithRatings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
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
    const sessionId = (req as any).sessionID;

    let cart;
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              item: {
                select: { 
                  id: true, title: true, price: true, imageUrl: true, 
                  stock: true, status: true, slug: true 
                }
              }
            }
          }
        }
      });
    } else if (sessionId) {
      cart = await prisma.cart.findFirst({
        where: { sessionId },
        include: {
          items: {
            include: {
              item: {
                select: { 
                  id: true, title: true, price: true, imageUrl: true, 
                  stock: true, status: true, slug: true 
                }
              }
            }
          }
        }
      });
    }

    if (!cart) {
      return res.json({ items: [], subtotal: 0, total: 0, itemCount: 0 });
    }

    const subtotal = cart.items.reduce((sum, item) => 
      sum + (Number(item.price) * item.quantity), 0
    );

    res.json({
      ...cart,
      subtotal,
      total: subtotal, // Can add tax/shipping calculation here
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    const userId = (req as any).user?.id;
    const sessionId = (req as any).sessionID;

    // Validate product
    const item = await prisma.marketplaceItem.findUnique({
      where: { id: itemId }
    });

    if (!item || item.status !== 'AVAILABLE' || !item.published) {
      return res.status(404).json({ error: 'Product not found or unavailable' });
    }

    if (item.stock < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock', 
        available: item.stock 
      });
    }

    // Find or create cart
    let cart;
    if (userId) {
      cart = await prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {}
      });
    } else if (sessionId) {
      cart = await prisma.cart.upsert({
        where: { sessionId },
        create: { sessionId },
        update: {}
      });
    } else {
      return res.status(400).json({ error: 'No user or session identified' });
    }

    // Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_itemId: {
          cartId: cart.id,
          itemId: itemId
        }
      },
      create: {
        cartId: cart.id,
        itemId: itemId,
        quantity: Number(quantity),
        price: item.price
      },
      update: {
        quantity: { increment: Number(quantity) },
        price: item.price // Update price in case it changed
      }
    });

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            item: {
              select: { 
                id: true, title: true, price: true, imageUrl: true, 
                stock: true, status: true, slug: true 
              }
            }
          }
        }
      }
    });

    const subtotal = updatedCart!.items.reduce((sum, item) => 
      sum + (Number(item.price) * item.quantity), 0
    );

    res.json({
      ...updatedCart,
      subtotal,
      total: subtotal,
      itemCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0)
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { 
      items, shippingAddress, billingAddress, 
      paymentMethod, notes, couponCode 
    } = req.body;
    const userId = (req as any).user?.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    // Validate all items and calculate totals
    const itemIds = items.map((item: any) => item.itemId);
    const marketplaceItems = await prisma.marketplaceItem.findMany({
      where: { id: { in: itemIds } }
    });

    let subtotal = 0;
    const orderItems = [];

    for (const orderItem of items) {
      const marketplaceItem = marketplaceItems.find(p => p.id === orderItem.itemId);
      if (!marketplaceItem) {
        return res.status(400).json({ 
          error: `Product ${orderItem.itemId} not found` 
        });
      }
      if (marketplaceItem.stock < orderItem.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${marketplaceItem.title}. Available: ${marketplaceItem.stock}` 
        });
      }

      const itemTotal = Number(marketplaceItem.price) * orderItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        itemId: orderItem.itemId,
        quantity: orderItem.quantity,
        price: marketplaceItem.price,
        total: itemTotal
      });
    }

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      });

      if (coupon && coupon.isActive) {
        // Simple coupon logic - can be enhanced
        if (coupon.type === 'PERCENTAGE') {
          discount = subtotal * (Number(coupon.value) / 100);
          if (coupon.maximumDiscount) {
            discount = Math.min(discount, Number(coupon.maximumDiscount));
          }
        } else if (coupon.type === 'FIXED_AMOUNT') {
          discount = Number(coupon.value);
        }
      }
    }

    const tax = (subtotal - discount) * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal - discount + tax + shipping;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order in transaction
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
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              item: {
                select: { id: true, title: true, imageUrl: true, slug: true }
              }
            }
          }
        }
      });

      // Update inventory
      for (const orderItem of orderItems) {
        await tx.marketplaceItem.update({
          where: { id: orderItem.itemId },
          data: { stock: { decrement: orderItem.quantity } }
        });

        // Create inventory adjustment record
        await tx.inventoryAdjustment.create({
          data: {
            itemId: orderItem.itemId,
            previousQuantity: 0, // Would need to fetch this in real implementation
            newQuantity: 0, // Would need to calculate this
            adjustment: -orderItem.quantity,
            reason: `Order ${orderNumber}`,
            userId
          }
        });
      }

      // Clear user's cart
      if (userId) {
        await tx.cartItem.deleteMany({
          where: {
            cart: { userId }
          }
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
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const whereClause = { createdAt: { gte: startDate } };

    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalProducts,
      lowStockProducts
    ] = await Promise.all([
      prisma.order.count({ where: whereClause }),
      prisma.order.aggregate({
        where: { ...whereClause, status: { not: 'CANCELLED' } },
        _sum: { total: true }
      }),
      prisma.order.count({ 
        where: { ...whereClause, status: 'PENDING' } 
      }),
      prisma.marketplaceItem.count({
        where: { published: true, status: 'AVAILABLE' }
      }),
      prisma.marketplaceItem.count({
        where: { stock: { lte: 5 }, published: true }
      })
    ]);

    res.json({
      metrics: {
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.total) || 0,
        pendingOrders,
        totalProducts,
        lowStockProducts
      },
      period
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};
