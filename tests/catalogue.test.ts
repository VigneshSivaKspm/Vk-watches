import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getCatalogueCollections,
  getCatalogueJournal,
  getCatalogueProductBySlug,
  queryCatalogueProducts,
  scoreWatchFinder,
} from '../apps/web/src/data/catalogueService';

describe('VK TIME Catalogue Service & Serverless Fallback', () => {
  it('resolves vk-chronos-skeleton-limited-41 with full specs and variants', () => {
    const watch = getCatalogueProductBySlug('vk-chronos-skeleton-limited-41');
    assert.ok(watch, 'Watch should exist in canonical catalogue');
    assert.strictEqual(watch.title, 'VK Chronos Skeleton Limited Edition');
    assert.strictEqual(watch.price, 89000);
    assert.ok(watch.specifications?.calibre);
    assert.ok(Array.isArray(watch.variants) && watch.variants.length > 0);
  });

  it('filters featured products with limit=8', () => {
    const res = queryCatalogueProducts(new URLSearchParams('isFeatured=true&limit=8'));
    assert.ok(res.products.length > 0 && res.products.length <= 8);
    assert.ok(res.products.every((p) => p.isFeatured));
  });

  it('returns collections, journal articles, and watch finder matches', () => {
    const collections = getCatalogueCollections();
    const journal = getCatalogueJournal();
    const finder = scoreWatchFinder({ gender: 'Men', movementType: 'Automatic', budget: [35000, 55000] });

    assert.strictEqual(collections.length, 5);
    assert.strictEqual(journal.length, 6);
    assert.strictEqual(finder.length, 3);
  });
});
