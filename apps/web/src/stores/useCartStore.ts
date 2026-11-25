import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { refreshProductImages } from '../lib/images';
import { CartItem, WatchProduct, Coupon } from '@vk-time/shared';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isOpen: boolean;
  addItem: (product: WatchProduct, options?: { dialColour?: string; strapMaterial?: string; quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      isOpen: false,

      addItem: (product, options) => {
        const { items } = get();
        const dial = options?.dialColour || product.variants[0]?.dialColour || 'Standard';
        const strap = options?.strapMaterial || product.specifications?.strapMaterial || 'Standard';
        const quantity = options?.quantity || 1;
        // Show the artwork of the colourway that was actually chosen
        const variantImage = product.variants?.find((v) => v.dialColour === dial)?.imageUrls?.[0];

        const existingIndex = items.findIndex(
          (i) => i.productId === product.id && i.selectedDialColour === dial && i.selectedStrapMaterial === strap
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated, isOpen: true });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${dial}-${strap}-${Date.now()}`,
            productId: product.id,
            product: variantImage ? { ...product, primaryImage: variantImage } : product,
            selectedDialColour: dial,
            selectedStrapMaterial: strap,
            quantity,
            price: product.price,
          };
          set({ items: [...items, newItem], isOpen: true });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        });
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      setIsOpen: (isOpen) => set({ isOpen }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;
        if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) return 0;
        if (appliedCoupon.discountPercent) {
          return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
        }
        if (appliedCoupon.discountAmount) {
          return Math.min(subtotal, appliedCoupon.discountAmount);
        }
        return 0;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxable = Math.max(0, subtotal - discount);
        return Math.round(taxable * 0.18); // Authoritative 18% GST standard
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const tax = get().getTax();
        return Math.max(0, subtotal - discount + tax);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'vk_time_cart',
      version: 1,
      // The drawer's open state is session UI, not saved data
      partialize: (state) => ({ items: state.items, appliedCoupon: state.appliedCoupon }) as CartState,
      merge: (persisted, current) => ({ ...current, ...(persisted as Partial<CartState>), isOpen: false }),
      migrate: (persisted) => {
        const state = persisted as CartState;
        return {
          ...state,
          items: (state.items || []).map((i) => ({ ...i, product: refreshProductImages(i.product) })),
        };
      },
    }
  )
);
