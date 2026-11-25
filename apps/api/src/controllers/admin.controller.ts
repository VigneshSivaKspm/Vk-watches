import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalRevenueRaw,
      totalOrders,
      totalCustomers,
      productsCount,
      lowStockCount,
      recentOrders,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
    ]);

    const totalRevenue = totalRevenueRaw._sum.totalAmount || 0;

    return res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      productsCount,
      lowStockCount,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : o.shippingAddress,
      })),
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return res.status(500).json({ error: 'Failed to retrieve operational metrics' });
  }
};

export const getAdminProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        collection: true,
        specifications: true,
        variants: true,
      },
    });

    return res.json(
      products.map((p) => ({
        ...p,
        galleryImages: JSON.parse(p.galleryImages || '[]'),
      }))
    );
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve product inventory' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { specifications, variants, collectionSlug, ...productData } = data;

    let collectionId = null;
    if (collectionSlug) {
      const coll = await prisma.collection.findUnique({ where: { slug: collectionSlug } });
      if (coll) collectionId = coll.id;
    }

    const created = await prisma.product.create({
      data: {
        ...productData,
        collectionId,
        galleryImages: JSON.stringify(data.galleryImages || []),
        specifications: specifications
          ? {
              create: {
                ...specifications,
                packageContents: JSON.stringify(specifications.packageContents || []),
              },
            }
          : undefined,
      },
      include: {
        specifications: true,
        collection: true,
      },
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return res.status(500).json({ error: 'Failed to create timepiece' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestseller: data.isBestseller,
        isLimitedEdition: data.isLimitedEdition,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Failed to update timepiece' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, message: 'Timepiece archived successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        timeline: { orderBy: { timestamp: 'asc' } },
      },
    });

    return res.json(
      orders.map((o) => ({
        ...o,
        shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : o.shippingAddress,
      }))
    );
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, description, trackingNumber, courierName } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: status,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
      },
    });

    if (description) {
      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status,
          description,
        },
      });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const getAdminCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(coupons);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load coupons' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, description, discountPercent, discountAmount, minOrderValue, validUntil } = req.body;
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountPercent: discountPercent ? parseFloat(discountPercent) : null,
        discountAmount: discountAmount ? parseFloat(discountAmount) : null,
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        validUntil: new Date(validUntil || '2028-12-31'),
        isActive: true,
      },
    });
    return res.status(201).json(coupon);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create promotional privilege coupon' });
  }
};
