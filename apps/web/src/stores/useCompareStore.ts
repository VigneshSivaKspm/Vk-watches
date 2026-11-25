import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { refreshProductImages } from '../lib/images';
import { WatchProduct } from '@vk-time/shared';

interface CompareState {
  watches: WatchProduct[];
  isOpen: boolean;
  addWatch: (watch: WatchProduct) => boolean;
  removeWatch: (watchId: string) => void;
  clearCompare: () => void;
  setIsOpen: (isOpen: boolean) => void;
  isInCompare: (watchId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      watches: [],
      isOpen: false,
      addWatch: (watch) => {
        const { watches } = get();
        if (watches.length >= 4) {
          return false; // Maximum 4 watches for precision comparison
        }
        if (!watches.some((w) => w.id === watch.id)) {
          set({ watches: [...watches, watch] });
        }
        return true;
      },
      removeWatch: (watchId) => {
        set({ watches: get().watches.filter((w) => w.id !== watchId) });
      },
      clearCompare: () => set({ watches: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      isInCompare: (watchId) => {
        return get().watches.some((w) => w.id === watchId);
      },
    }),
    {
      name: 'vk_time_compare',
      version: 1,
      migrate: (persisted) => {
        const state = persisted as CompareState;
        return { ...state, watches: (state.watches || []).map(refreshProductImages) };
      },
    }
  )
);
