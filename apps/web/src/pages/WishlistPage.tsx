import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '../stores/useWishlistStore';
import { useCartStore } from '../stores/useCartStore';
import { ProductCard } from '../components/product/ProductCard';

export const WishlistPage: React.FC = () => {
  const { items, clearWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4 min-h-[60vh] flex flex-col items-center justify-center">
        <Heart className="w-12 h-12 text-silver mx-auto" />
        <h2 className="font-serif-luxury text-3xl text-charcoal">Your Wishlist is Empty</h2>
        <p className="text-xs text-graphite max-w-md">
          Save your favourite timepieces here to review specifications, compare models, and acquire at your leisure.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-platinum pb-4 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Saved Collection</span>
            <h1 className="font-serif-luxury text-3xl text-charcoal">Your Personal Wishlist</h1>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs text-silver hover:text-red-500 transition-colors"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
