import { WatchProduct } from '@vk-time/shared';

export const watchArt = (slug: string, view: 'front' | 'tilt' | 'macro' | 'flat' | 'alt' = 'front') =>
  `/images/watches/${slug}-${view}.svg`;

export const sceneArt = (name: string) => `/images/scenes/${name}.svg`;

const isLegacy = (url?: string) => !url || url.includes('images.unsplash.com');

/**
 * Carts / wishlists saved in the browser before the artwork refresh still
 * hold retired stock-photo URLs. Point them at the current VK artwork.
 */
export function refreshProductImages(product: WatchProduct): WatchProduct {
  if (!product || !isLegacy(product.primaryImage)) return product;
  return {
    ...product,
    primaryImage: watchArt(product.slug),
    secondaryImage: watchArt(product.slug, 'tilt'),
    galleryImages: (['front', 'tilt', 'macro', 'flat'] as const).map((v) => watchArt(product.slug, v)),
    variants: (product.variants || []).map((v, i) => ({
      ...v,
      imageUrls: [watchArt(product.slug, i === 0 ? 'front' : 'alt')],
    })),
  };
}
