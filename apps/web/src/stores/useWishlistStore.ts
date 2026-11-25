import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { refreshProductImages } from '../lib/images';
import { WatchProduct } from '@vk-time/shared';

interface WishlistState {
  items: WatchProduct[];
  toggleWishlist: (product: WatchProduct) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.some((p) => p.id === product.id);
        if (exists) {
          set({ items: items.filter((p) => p.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      isInWishlist: (productId) => {
        return get().items.some((p) => p.id === productId);
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((p) => p.id !== productId) });
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'vk_time_wishlist',
      version: 1,
      migrate: (persisted) => {
        const state = persisted as WishlistState;
        return { ...state, items: (state.items || []).map(refreshProductImages) };
      },
    }
  )
);
