import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      collection,
      gender,
      movementType,
      minPrice,
      maxPrice,
      sort,
      search,
      caseDiameter,
      caseMaterial,
      strapMaterial,
      isFeatured,
      isNewArrival,
      isBestseller,
      isLimitedEdition,
      limit = '24',
      page = '1',
    } = req.query;

    const where: any = {};

    if (collection) {
      where.collection = { slug: String(collection) };
    }

    if (gender && gender !== 'All') {
      where.gender = { in: [String(gender), 'Unisex'] };
    }

    if (movementType) {
      where.movementType = String(movementType);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }

    if (isFeatured === 'true') where.isFeatured = true;
    if (isNewArrival === 'true') where.isNewArrival = true;
    if (isBestseller === 'true') where.isBestseller = true;
    if (isLimitedEdition === 'true') where.isLimitedEdition = true;

    if (search) {
      const q = String(search).toLowerCase();
      where.OR = [
        { title: { contains: q } },
        { subtitle: { contains: q } },
        { description: { contains: q } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'bestsellers') orderBy = { isBestseller: 'desc' };

    const take = parseInt(String(limit), 10);
    const skip = (parseInt(String(page), 10) - 1) * take;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take,
        skip,
        include: {
          collection: true,
          specifications: true,
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Format for response
    const formatted = products.map((p) => ({
      ...p,
      collectionSlug: p.collection?.slug,
      collectionName: p.collection?.name,
      galleryImages: JSON.parse(p.galleryImages || '[]'),
      specifications: p.specifications
        ? {
            ...p.specifications,
            packageContents: JSON.parse(p.specifications.packageContents || '[]'),
            wristSizeRangeMm: [p.specifications.wristSizeMinMm, p.specifications.wristSizeMaxMm],
          }
        : null,
      variants: p.variants.map((v) => ({
        ...v,
        imageUrls: JSON.parse(v.imageUrls || '[]'),
      })),
    }));

    return res.json({
      products: formatted,
      totalCount,
      page: parseInt(String(page), 10),
      totalPages: Math.ceil(totalCount / take),
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    return res.status(500).json({ error: 'Failed to retrieve watch catalog' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        collection: true,
        specifications: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Timepiece not found' });
    }

    const formatted = {
      ...product,
      collectionSlug: product.collection?.slug,
      collectionName: product.collection?.name,
      galleryImages: JSON.parse(product.galleryImages || '[]'),
      specifications: product.specifications
        ? {
            ...product.specifications,
            packageContents: JSON.parse(product.specifications.packageContents || '[]'),
            wristSizeRangeMm: [product.specifications.wristSizeMinMm, product.specifications.wristSizeMaxMm],
          }
        : null,
      variants: product.variants.map((v) => ({
        ...v,
        imageUrls: JSON.parse(v.imageUrls || '[]'),
      })),
    };

    return res.json(formatted);
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return res.status(500).json({ error: 'Failed to retrieve timepiece details' });
  }
};

export const getComparison = async (req: Request, res: Response) => {
  try {
    const { slugs } = req.query;
    if (!slugs) {
      return res.status(400).json({ error: 'Slugs parameter required' });
    }

    const slugList = String(slugs).split(',');
    const products = await prisma.product.findMany({
      where: { slug: { in: slugList } },
      include: {
        specifications: true,
        variants: true,
        collection: true,
      },
    });

    const formatted = products.map((p) => ({
      ...p,
      galleryImages: JSON.parse(p.galleryImages || '[]'),
      specifications: p.specifications
        ? {
            ...p.specifications,
            packageContents: JSON.parse(p.specifications.packageContents || '[]'),
            wristSizeRangeMm: [p.specifications.wristSizeMinMm, p.specifications.wristSizeMaxMm],
          }
        : null,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Error in getComparison:', error);
    return res.status(500).json({ error: 'Failed to load comparison' });
  }
};

export const watchFinderRecommend = async (req: Request, res: Response) => {
  try {
    const { gender, style, budget, movementType, strapMaterial, occasion } = req.body;

    const allProducts = await prisma.product.findMany({
      include: {
        specifications: true,
        collection: true,
      },
    });

    // Score each product based on customer answers
    const scored = allProducts.map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // Gender preference
      if (gender) {
        if (p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'Unisex') {
          score += 25;
          reasons.push(`Tailored for ${gender} wrist proportions.`);
        }
      }

      // Movement preference
      if (movementType && movementType !== 'Any') {
        if (p.movementType.toLowerCase() === movementType.toLowerCase()) {
          score += 30;
          reasons.push(`Features your desired ${p.movementType} movement.`);
        }
      }

      // Budget preference
      if (budget) {
        const [minB, maxB] = budget;
        if (p.price >= minB && p.price <= maxB) {
          score += 25;
          reasons.push(`Directly matches your designated investment bracket.`);
        }
      }

      // Strap preference
      if (strapMaterial && p.specifications) {
        if (p.specifications.strapMaterial.toLowerCase().includes(strapMaterial.toLowerCase())) {
          score += 20;
          reasons.push(`Fitted with premium ${p.specifications.strapMaterial}.`);
        }
      }

      return {
        product: {
          ...p,
          galleryImages: JSON.parse(p.galleryImages || '[]'),
          specifications: p.specifications
            ? {
                ...p.specifications,
                packageContents: JSON.parse(p.specifications.packageContents || '[]'),
              }
            : null,
        },
        score,
        matchReasons: reasons.length > 0 ? reasons : ['Matches high VK TIME precision standards.'],
      };
    });

    // Sort descending by match score
    scored.sort((a, b) => b.score - a.score);

    return res.json(scored.slice(0, 3));
  } catch (error) {
    console.error('Error in watchFinderRecommend:', error);
    return res.status(500).json({ error: 'Failed to calculate watch recommendations' });
  }
};

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const formatted = collections.map((c) => ({
      ...c,
      productCount: c._count.products,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Error in getCollections:', error);
    return res.status(500).json({ error: 'Failed to load collections' });
  }
};

export const getCollectionBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            specifications: true,
            variants: true,
          },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    return res.json(collection);
  } catch (error) {
    console.error('Error in getCollectionBySlug:', error);
    return res.status(500).json({ error: 'Failed to load collection details' });
  }
};
