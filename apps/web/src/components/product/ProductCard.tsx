import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, SlidersHorizontal, ShoppingBag, Eye } from 'lucide-react';
import { WatchProduct } from '@vk-time/shared';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCompareStore } from '../../stores/useCompareStore';

interface ProductCardProps {
  product: WatchProduct;
  onQuickView?: (product: WatchProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isInCompare, addWatch, removeWatch } = useCompareStore();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCompared) {
      removeWatch(product.id);
    } else {
      addWatch(product);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <div className="group relative flex flex-1 flex-col bg-pure border border-platinum/60 hover:border-gold/60 transition-all duration-500 rounded-sm overflow-hidden hover:-translate-y-2 hover:shadow-luxe-hover">
      {/* Visual Badge: Limited Edition / New / Bestseller */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isLimitedEdition && (
          <span className="bg-charcoal text-pure text-[9px] uppercase tracking-luxury px-2 py-0.5 rounded-sm font-medium">
            Limited &bull; {product.editionLimit ? `${product.editionLimit} Pcs` : 'Rare'}
          </span>
        )}
        {product.isNewArrival && !product.isLimitedEdition && (
          <span className="bg-pure/90 border border-platinum text-charcoal text-[9px] uppercase tracking-luxury px-2 py-0.5 rounded-sm font-medium">
            New Release
          </span>
        )}
        {product.isBestseller && !product.isLimitedEdition && !product.isNewArrival && (
          <span className="bg-gold/15 border border-gold/30 text-gold-dark text-[9px] uppercase tracking-luxury px-2 py-0.5 rounded-sm font-medium">
            Signature
          </span>
        )}
      </div>

      {/* Floating Action Icons (Wishlist & Compare) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleWishlistClick}
          className={`p-2 rounded-full transition-colors shadow-sm ${
            isFavorited
              ? 'bg-gold text-pure'
              : 'bg-pure/90 hover:bg-pure text-charcoal hover:text-gold'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleCompareClick}
          className={`p-2 rounded-full transition-colors shadow-sm ${
            isCompared
              ? 'bg-charcoal text-pure'
              : 'bg-pure/90 hover:bg-pure text-charcoal hover:text-gold'
          }`}
          aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image Gallery Link with Smooth Crossfade */}
      <Link to={`/watch/${product.slug}`} className="shine block aspect-square bg-porcelain">
        {/* Primary Image */}
        <img
          src={product.primaryImage}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
          loading="lazy"
        />
        {/* Secondary Image Crossfade */}
        <img
          src={product.secondaryImage || product.primaryImage}
          alt={`${product.title} Profile`}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Desktop Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-pure/90 via-pure/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:flex gap-2">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="flex-1 py-2 bg-pure text-charcoal text-[10px] uppercase tracking-wider font-medium border border-platinum hover:border-charcoal flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Eye className="w-3 h-3" />
              <span>Quick View</span>
            </button>
          )}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 bg-charcoal text-pure text-[10px] uppercase tracking-wider font-medium hover:bg-gold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add to Bag</span>
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-pure">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-luxury text-silver font-medium">
            {product.movementType} &bull; {product.caseDiameterMm}mm
          </p>
          <Link
            to={`/watch/${product.slug}`}
            className="font-serif-luxury text-lg text-charcoal hover:text-gold transition-colors line-clamp-1"
          >
            {product.title}
          </Link>
          <p className="text-xs text-graphite/70 line-clamp-1 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing and Mobile Add to Bag */}
        <div className="pt-3 mt-2 border-t border-platinum/50 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif-luxury text-base font-medium text-charcoal">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-silver line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile Cart Trigger */}
          <button
            onClick={handleAddToCart}
            className="sm:hidden p-2 text-charcoal hover:text-gold"
            aria-label="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
