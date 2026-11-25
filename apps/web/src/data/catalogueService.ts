import catalogueData from './catalogue.json';

export interface CatalogueProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  collectionSlug: string;
  collectionName: string;
  collection?: { id: string; slug: string; name: string; tagline: string };
  category: string;
  gender: string;
  movementType: string;
  caseDiameterMm: number;
  price: number;
  compareAtPrice?: number;
  currency: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isLimitedEdition: boolean;
  editionLimit?: number;
  stock: number;
  primaryImage: string;
  secondaryImage: string;
  galleryImages: string[];
  specifications: Record<string, any>;
  variants: Array<Record<string, any>>;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogueCollection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  thumbnailImage: string;
  accentQuote?: string;
  aestheticTone: string;
  productCount: number;
}

export interface CatalogueArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readingTimeMinutes: number;
  category: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
}

const data = catalogueData as unknown as {
  collections: CatalogueCollection[];
  products: CatalogueProduct[];
  journal: CatalogueArticle[];
};

export function queryCatalogueProducts(params: URLSearchParams) {
  const collection = params.get('collection');
  const gender = params.get('gender');
  const movementType = params.get('movementType');
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  const sort = params.get('sort');
  const search = params.get('search');
  const isFeatured = params.get('isFeatured');
  const isNewArrival = params.get('isNewArrival');
  const isBestseller = params.get('isBestseller');
  const isLimitedEdition = params.get('isLimitedEdition');
  const limit = Math.max(1, parseInt(params.get('limit') || '24', 10) || 24);
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);

  let list = [...data.products];

  if (collection && collection !== 'All') {
    list = list.filter((p) => p.collectionSlug === collection);
  }
  if (gender && gender !== 'All') {
    list = list.filter((p) => p.gender === gender || p.gender === 'Unisex');
  }
  if (movementType && movementType !== 'All') {
    list = list.filter((p) => p.movementType === movementType);
  }
  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
  }
  if (isFeatured === 'true') list = list.filter((p) => p.isFeatured);
  if (isNewArrival === 'true') list = list.filter((p) => p.isNewArrival);
  if (isBestseller === 'true') list = list.filter((p) => p.isBestseller);
  if (isLimitedEdition === 'true') list = list.filter((p) => p.isLimitedEdition);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.movementType.toLowerCase().includes(q) ||
        p.collectionName.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'bestsellers') list.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));

  const totalCount = list.length;
  const start = (page - 1) * limit;
  const products = list.slice(start, start + limit);

  return {
    products,
    totalCount,
    page,
    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
  };
}

export function getCatalogueProductBySlug(slug: string): CatalogueProduct | null {
  return data.products.find((p) => p.slug === slug) || null;
}

export function getCatalogueComparison(slugsParam: string): CatalogueProduct[] {
  const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean);
  return data.products.filter((p) => slugs.includes(p.slug));
}

export function scoreWatchFinder(body: {
  gender?: string;
  budget?: [number, number];
  movementType?: string;
  strapMaterial?: string;
}) {
  const { gender, budget, movementType, strapMaterial } = body || {};
  const scored = data.products.map((p) => {
    let score = 0;
    const reasons: string[] = [];

    if (gender && (p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'Unisex')) {
      score += 25;
      reasons.push(`Tailored for ${gender} wrist proportions.`);
    }
    if (movementType && movementType !== 'Any' && p.movementType.toLowerCase() === movementType.toLowerCase()) {
      score += 30;
      reasons.push(`Features your desired ${p.movementType} movement.`);
    }
    if (Array.isArray(budget) && budget.length === 2 && p.price >= budget[0] && p.price <= budget[1]) {
      score += 25;
      reasons.push('Directly matches your designated investment bracket.');
    }
    if (strapMaterial && String(p.specifications?.strapMaterial || '').toLowerCase().includes(strapMaterial.toLowerCase())) {
      score += 20;
      reasons.push(`Fitted with premium ${p.specifications.strapMaterial}.`);
    }

    return {
      product: p,
      score,
      matchReasons: reasons.length > 0 ? reasons : ['Matches high VK TIME precision standards.'],
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

export function getCatalogueCollections(): CatalogueCollection[] {
  return data.collections;
}

export function getCatalogueCollectionBySlug(slug: string) {
  const coll = data.collections.find((c) => c.slug === slug);
  if (!coll) return null;
  return {
    ...coll,
    products: data.products.filter((p) => p.collectionSlug === slug),
  };
}

export function getCatalogueJournal(): CatalogueArticle[] {
  return data.journal;
}

export function getCatalogueJournalBySlug(slug: string): CatalogueArticle | null {
  return data.journal.find((a) => a.slug === slug) || null;
}

export function buildCataloguePromptText(): string {
  const rows = data.products.map((p) => {
    const flags = [
      p.isBestseller && 'bestseller',
      p.isNewArrival && 'new',
      p.isLimitedEdition && `limited${p.editionLimit ? ` ${p.editionLimit}pcs` : ''}`,
    ]
      .filter(Boolean)
      .join(',');
    const stock = p.stock <= 0 ? 'sold out' : p.stock <= 5 ? 'low stock' : 'in stock';
    const dials = p.variants.map((v) => v.dialColour).join('/') || '-';
    return [
      p.slug,
      p.title,
      p.gender,
      p.movementType,
      `${p.caseDiameterMm}mm`,
      `₹${p.price.toLocaleString('en-IN')}`,
      p.collectionName.replace(/^The | Collection$/g, ''),
      p.specifications?.strapMaterial ?? '-',
      p.specifications ? `${p.specifications.waterResistanceMeters}m` : '-',
      dials,
      stock,
      flags || '-',
    ].join('|');
  });

  return [
    'slug|name|gender|movement|case|price|collection|strap|water|dials|stock|tags',
    ...rows,
  ].join('\n');
}
