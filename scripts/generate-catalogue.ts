/**
 * Generates apps/web/src/data/catalogue.json from apps/api/src/seed.ts and catalog.ts.
 * Keeps the static storefront fallback and Vercel API handler synchronized with the DB seed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  seedCollections,
  seedProducts,
  seedCoupons,
  seedJournal,
} from '../apps/api/src/seed';
import {
  withArtwork,
  extraProducts,
  extraJournal,
  collectionArtwork,
  journalArtwork,
} from '../apps/api/src/catalog';

const root = resolve(__dirname, '..');
const outFile = resolve(root, 'apps/web/src/data/catalogue.json');

const rawProducts = [...seedProducts, ...extraProducts].map(withArtwork);

const collections = seedCollections.map((c, idx) => {
  const art = collectionArtwork(c.slug);
  const count = rawProducts.filter((p) => p.collectionSlug === c.slug).length;
  return {
    id: `col-${idx + 1}`,
    ...c,
    ...art,
    productCount: count,
  };
});

const collBySlug = new Map(collections.map((c) => [c.slug, c]));
const nowIso = new Date().toISOString();

const products = rawProducts.map((p, idx) => {
  const coll = collBySlug.get(p.collectionSlug);
  const galleryImages = JSON.parse(p.galleryImages || '[]');
  const packageContents = JSON.parse(p.specifications.packageContents || '[]');

  return {
    id: `prod-${idx + 1}`,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    shortDescription: p.shortDescription,
    collectionSlug: p.collectionSlug,
    collectionName: coll?.name || 'VK Signature',
    collection: coll
      ? { id: coll.id, slug: coll.slug, name: coll.name, tagline: coll.tagline }
      : undefined,
    category: p.collectionSlug,
    gender: p.gender,
    movementType: p.movementType,
    caseDiameterMm: p.caseDiameterMm,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    currency: p.currency,
    isFeatured: p.isFeatured,
    isNewArrival: p.isNewArrival,
    isBestseller: p.isBestseller,
    isLimitedEdition: p.isLimitedEdition,
    editionLimit: p.editionLimit,
    stock: p.stock,
    primaryImage: p.primaryImage,
    secondaryImage: p.secondaryImage,
    galleryImages,
    specifications: {
      ...p.specifications,
      collection: coll?.name || 'VK Signature',
      gender: p.gender,
      watchType: p.movementType,
      packageContents,
      wristSizeRangeMm: [p.specifications.wristSizeMinMm, p.specifications.wristSizeMaxMm],
    },
    variants: p.variants.map((v, vIdx) => ({
      id: `var-${idx + 1}-${vIdx + 1}`,
      productId: `prod-${idx + 1}`,
      sku: v.sku,
      dialColour: v.dialColour,
      strapColour: v.strapColour,
      strapMaterial: v.strapMaterial,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      stock: v.stock,
      imageUrls: JSON.parse(v.imageUrls || '[]'),
    })),
    rating: 4.9,
    reviewCount: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
});

const journal = [...seedJournal, ...extraJournal].map((a, idx) => ({
  id: `art-${idx + 1}`,
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  content: a.content,
  author: a.author,
  readingTimeMinutes: a.readingTimeMinutes,
  category: a.category,
  coverImage: journalArtwork[a.slug] ?? a.coverImage,
  tags: JSON.parse(a.tags || '[]'),
  publishedAt: nowIso,
}));

const coupons = seedCoupons.map((c) => ({
  ...c,
  validUntil: c.validUntil.toISOString(),
}));

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  JSON.stringify({ collections, products, journal, coupons }, null, 2) + '\n',
  'utf8'
);

console.log(
  `Generated catalogue.json: ${products.length} watches, ${collections.length} collections, ${journal.length} articles.`
);
