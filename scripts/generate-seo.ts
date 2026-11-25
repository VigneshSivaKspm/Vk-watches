/**
 * Writes apps/web/public/robots.txt and sitemap.xml.
 *   npm run seo
 *
 * The website address comes from apps/web/site.config.json.
 * A SITE_URL environment variable overrides it (e.g. for a staging copy).
 *
 * Pages come from the database; if it is unreachable, from the seed catalogue.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const root = resolve(__dirname, '..');
const publicDir = join(root, 'apps', 'web', 'public');
const apiRequire = createRequire(join(root, 'apps', 'api', 'package.json'));
const dotenv = apiRequire('dotenv') as typeof import('dotenv');

const readEnv = (path: string) => (existsSync(path) ? dotenv.parse(readFileSync(path)) : {});

/* ------------------------------ Site address ------------------------------ */
function toOrigin(value: string): string {
  const text = value.trim();
  const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`SITE_URL must be just the domain, e.g. https://www.your-domain.com (got "${value}")`);
  }
  return url.origin;
}

function resolveSiteUrl(): string {
  const config = JSON.parse(readFileSync(join(root, 'apps', 'web', 'site.config.json'), 'utf8'));
  const value = process.env.SITE_URL?.trim() || String(config.siteUrl ?? '').trim();
  if (!value) throw new Error('Set "siteUrl" in apps/web/site.config.json');
  return toOrigin(value);
}

/* --------------------------------- Content -------------------------------- */
interface Item {
  slug: string;
  name: string;
  images: string[];
  updated?: Date;
}
interface Content {
  collections: Item[];
  products: Array<Item & { collection?: string }>;
  articles: Item[];
  source: string;
}

const parseList = (json: string): string[] => {
  try {
    const list = JSON.parse(json || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

async function fromDatabase(): Promise<Content> {
  const apiEnv = readEnv(join(root, 'apps', 'api', '.env'));
  process.env.DATABASE_URL ||= apiEnv.DATABASE_URL;
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

  const { prisma } = await import('../apps/api/src/config/prisma');
  try {
    const [collections, products, articles] = await Promise.all([
      prisma.collection.findMany({ orderBy: { name: 'asc' } }),
      prisma.product.findMany({ orderBy: { title: 'asc' }, include: { collection: true } }),
      prisma.journalArticle.findMany({ orderBy: { publishedAt: 'desc' } }),
    ]);
    if (!products.length) throw new Error('the database has no products');

    return {
      source: 'database',
      collections: collections.map((c) => ({ slug: c.slug, name: c.name, images: [c.heroImage], updated: c.updatedAt })),
      products: products.map((p) => ({
        slug: p.slug,
        name: p.title,
        collection: p.collection?.slug,
        images: [p.primaryImage, ...parseList(p.galleryImages)],
        updated: p.updatedAt,
      })),
      articles: articles.map((a) => ({ slug: a.slug, name: a.title, images: [a.coverImage], updated: a.publishedAt })),
    };
  } finally {
    await prisma.$disconnect();
  }
}

async function fromSeed(): Promise<Content> {
  const seed = await import('../apps/api/src/seed');
  const catalog = await import('../apps/api/src/catalog');

  return {
    source: 'seed catalogue',
    collections: seed.seedCollections.map((c) => ({
      slug: c.slug,
      name: c.name,
      images: [catalog.collectionArtwork(c.slug).heroImage],
    })),
    products: [...seed.seedProducts, ...catalog.extraProducts].map(catalog.withArtwork).map((p) => ({
      slug: p.slug,
      name: p.title,
      collection: p.collectionSlug,
      images: [p.primaryImage, ...parseList(p.galleryImages)],
    })),
    articles: [...seed.seedJournal, ...catalog.extraJournal].map((a) => ({
      slug: a.slug,
      name: a.title,
      images: [catalog.journalArtwork[a.slug] ?? a.coverImage],
    })),
  };
}

/* ----------------------------------- XML ---------------------------------- */
const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

// "--" is not allowed inside an XML comment
const comment = (text: string, indent = '  ') => `${indent}<!-- ${text.replace(/-{2,}/g, '-')} -->`;

function buildSitemap(site: string, content: Content): { xml: string; count: number } {
  let count = 0;
  const absolute = (path: string) => (/^https?:\/\//i.test(path) ? path : `${site}${path.startsWith('/') ? '' : '/'}${path}`);

  const entry = (
    path: string,
    priority: string,
    changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly',
    extra: { updated?: Date; images?: string[] } = {}
  ) => {
    count++;
    const images = [...new Set((extra.images ?? []).filter(Boolean))];
    return [
      '  <url>',
      `    <loc>${escapeXml(absolute(path))}</loc>`,
      extra.updated ? `    <lastmod>${extra.updated.toISOString().slice(0, 10)}</lastmod>` : '',
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      ...images.map((src) => `    <image:image>\n      <image:loc>${escapeXml(absolute(src))}</image:loc>\n    </image:image>`),
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const slugPath = (base: string, slug: string) => `${base}/${encodeURIComponent(slug)}`;
  const watch = (p: Content['products'][number]) =>
    entry(slugPath('/watch', p.slug), '0.8', 'weekly', { updated: p.updated, images: p.images });

  const out: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '',
    comment('1. HOME'),
    entry('/', '1.0', 'daily'),
    '',
    comment('2. SHOP'),
    entry('/shop', '0.9', 'daily'),
    ...['/men', '/women', '/unisex', '/new-arrivals', '/bestsellers', '/limited-edition'].map((p) =>
      entry(p, '0.8', 'weekly')
    ),
    '',
    comment('3. COLLECTIONS and their watches'),
    entry('/collections', '0.8', 'weekly'),
  ];

  const listed = new Set<string>();
  for (const c of content.collections) {
    out.push('', comment(`3 > ${c.name}`));
    out.push(entry(slugPath('/collections', c.slug), '0.7', 'weekly', { updated: c.updated, images: c.images }));
    for (const p of content.products.filter((x) => x.collection === c.slug)) {
      listed.add(p.slug);
      out.push(watch(p));
    }
  }

  const others = content.products.filter((p) => !listed.has(p.slug));
  if (others.length) out.push('', comment('3 > Watches outside a collection'), ...others.map(watch));

  out.push(
    '',
    comment('4. JOURNAL'),
    entry('/journal', '0.6', 'weekly'),
    ...content.articles.map((a) =>
      entry(slugPath('/journal', a.slug), '0.5', 'monthly', { updated: a.updated, images: a.images })
    ),
    '',
    comment('5. BRAND AND CUSTOMER GUIDES'),
    ...['/about', '/craftsmanship', '/watch-finder', '/size-guide', '/watch-care', '/warranty', '/faq', '/contact'].map(
      (p) => entry(p, '0.5', 'monthly')
    ),
    '',
    comment('6. POLICIES'),
    ...['/shipping-policy', '/return-policy', '/privacy-policy', '/terms'].map((p) => entry(p, '0.3', 'yearly')),
    '',
    '</urlset>',
    ''
  );

  return { xml: out.join('\n'), count };
}

/* -------------------------------- robots.txt ------------------------------ */
const buildRobots = (site: string) => `# VK TIME - robots.txt
# Generated by "npm run seo". Edit scripts/generate-seo.ts, not this file.

User-agent: *
Allow: /

# Admin panel
Disallow: /admin

# Personal and checkout pages (nothing useful for search results)
Disallow: /account
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /cart
Disallow: /checkout
Disallow: /order-success
Disallow: /track-order
Disallow: /wishlist
Disallow: /compare
Disallow: /search

# Private API routes. Product, collection and journal APIs stay open,
# because search engines need them to render the pages.
Disallow: /api/admin
Disallow: /api/auth
Disallow: /api/account
Disallow: /api/orders
Disallow: /api/checkout
Disallow: /api/chat

Sitemap: ${site}/sitemap.xml
`;

/* ----------------------------------- Run ---------------------------------- */
async function main() {
  const site = resolveSiteUrl();

  let content: Content;
  try {
    content = await fromDatabase();
  } catch (error) {
    const reason = error instanceof Error ? error.message.trim().split('\n').pop() : String(error);
    console.warn(`Database not used (${reason}). Falling back to the seed catalogue.`);
    content = await fromSeed();
  }

  const { xml, count } = buildSitemap(site, content);
  writeFileSync(join(publicDir, 'sitemap.xml'), xml);
  writeFileSync(join(publicDir, 'robots.txt'), buildRobots(site));

  console.log(`SEO files written: ${count} pages from the ${content.source} for ${site}`);
}

main().catch((error) => {
  console.error('Could not generate SEO files:', error instanceof Error ? error.message : error);
  process.exit(1);
});
