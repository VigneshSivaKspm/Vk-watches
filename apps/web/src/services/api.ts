import { useAuthStore } from '../stores/useAuthStore';
import {
  getCatalogueCollectionBySlug,
  getCatalogueCollections,
  getCatalogueComparison,
  getCatalogueJournal,
  getCatalogueJournalBySlug,
  getCatalogueProductBySlug,
  queryCatalogueProducts,
  scoreWatchFinder,
} from '../data/catalogueService';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/** Fallback to canonical catalogue JSON only for public read endpoints when /api is unreachable or returns 404. */
function tryCatalogueFallback<T>(endpoint: string, options: RequestInit): T | null {
  const method = (options.method || 'GET').toUpperCase();
  const [path, queryStr = ''] = endpoint.split('?');
  const params = new URLSearchParams(queryStr);

  if (method === 'GET' && path === '/products') {
    return queryCatalogueProducts(params) as T;
  }
  if (method === 'GET' && path === '/products/compare') {
    const slugs = params.get('slugs');
    return (slugs ? getCatalogueComparison(slugs) : []) as T;
  }
  if (method === 'POST' && path === '/products/finder') {
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : {};
    return scoreWatchFinder(body) as T;
  }
  if (method === 'GET' && path.startsWith('/products/')) {
    const slug = decodeURIComponent(path.slice('/products/'.length));
    return getCatalogueProductBySlug(slug) as T | null;
  }
  if (method === 'GET' && path === '/collections') {
    return getCatalogueCollections() as T;
  }
  if (method === 'GET' && path.startsWith('/collections/')) {
    const slug = decodeURIComponent(path.slice('/collections/'.length));
    return getCatalogueCollectionBySlug(slug) as T | null;
  }
  if (method === 'GET' && path === '/journal') {
    return getCatalogueJournal() as T;
  }
  if (method === 'GET' && path.startsWith('/journal/')) {
    const slug = decodeURIComponent(path.slice('/journal/'.length));
    return getCatalogueJournalBySlug(slug) as T | null;
  }
  return null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 404 || response.status >= 502) {
        const fallback = tryCatalogueFallback<T>(endpoint, options);
        if (fallback !== null) return fallback;
      }
      throw new Error(data?.error || `Horological API Error: ${response.statusText || response.status}`);
    }

    return data;
  } catch (error) {
    const fallback = tryCatalogueFallback<T>(endpoint, options);
    if (fallback !== null) return fallback;
    throw error;
  }
}
