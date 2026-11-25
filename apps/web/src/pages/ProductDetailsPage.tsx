import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  SlidersHorizontal,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Maximize2,
  X,
  Compass,
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { WatchProduct } from '@vk-time/shared';
import { useCartStore } from '../stores/useCartStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import { useCompareStore } from '../stores/useCompareStore';
import { ProductCard } from '../components/product/ProductCard';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<WatchProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [selectedDial, setSelectedDial] = useState<string>('');
  const [selectedStrap, setSelectedStrap] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<WatchProduct[]>([]);

  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isInCompare, addWatch, removeWatch } = useCompareStore();

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await apiRequest<WatchProduct>(`/products/${slug}`);
        setProduct(data);
        setSelectedImage(data.primaryImage);
        setSelectedDial(data.variants[0]?.dialColour || data.specifications?.dialColour || 'Standard');
        setSelectedStrap(data.variants[0]?.strapMaterial || data.specifications?.strapMaterial || 'Standard');

        // Fetch related products
        const relatedRes = await apiRequest<{ products: WatchProduct[] }>(
          `/products?collection=${data.collectionSlug}&limit=4`
        );
        setRelatedProducts(relatedRes.products.filter((p) => p.id !== data.id));
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-charcoal border-t-gold rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-luxury text-silver">Calibrating Master Timepiece...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="font-serif-luxury text-3xl text-charcoal">Timepiece Not Found</h2>
        <p className="text-xs text-graphite">The requested reference is unavailable in the current archive.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const allImages = Array.from(
    new Set([product.primaryImage, product.secondaryImage, ...(product.galleryImages || [])].filter(Boolean))
  );
  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const specs = product.specifications;

  const handleAddToCart = () => {
    addItem(product, {
      dialColour: selectedDial,
      strapMaterial: selectedStrap,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="w-full bg-pure/80 text-charcoal pb-24">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-silver border-b border-platinum flex items-center space-x-2">
        <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-charcoal transition-colors">Watches</Link>
        <span>/</span>
        <span className="text-charcoal font-medium">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Interactive Macro Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Focused View */}
          <div className="relative aspect-square bg-ivory rounded-sm border border-platinum overflow-hidden shadow-luxe group">
            <motion.img
              key={selectedImage}
              src={selectedImage}
              alt={product.title}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onMouseMove={(e) => {
                const r = e.currentTarget.parentElement!.getBoundingClientRect();
                e.currentTarget.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
              }}
              className="w-full h-full object-cover cursor-zoom-in [scale:1] transition-[scale] duration-500 hover:[scale:1.7]"
            />
            <button
              onClick={() => setFullscreenImage(selectedImage)}
              className="absolute top-4 right-4 p-2 bg-pure/90 hover:bg-pure rounded-full border border-platinum shadow-sm text-charcoal hover:text-gold transition-colors"
              aria-label="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails Navigation */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 flex-shrink-0 bg-porcelain rounded-sm border overflow-hidden transition-all ${
                  selectedImage === img
                    ? 'border-charcoal ring-1 ring-charcoal'
                    : 'border-platinum hover:border-silver'
                }`}
              >
                <img loading="lazy" decoding="async" src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Horological Purchase Presentation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1.5 border-b border-platinum pb-6">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">
                {product.collectionName || 'Signature Series'} &bull; {product.movementType}
              </span>
              <span className="text-xs text-silver font-mono">Ref: {specs?.modelNumber || product.slug}</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-charcoal">{product.title}</h1>
            <p className="text-xs text-graphite/80 font-light">{product.subtitle}</p>
            <div className="pt-2 flex items-baseline gap-4">
              <span className="font-serif-luxury text-3xl font-medium text-charcoal">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-silver line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] text-silver font-light">Taxes inclusive &bull; Insured Delivery</span>
            </div>
          </div>

          <p className="text-xs text-graphite leading-relaxed font-light">{product.description}</p>

          {/* Variant Selectors: Dial & Strap */}
          <div className="space-y-4 pt-2">
            {product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-charcoal block">Dial Finish & Colour</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedDial(v.dialColour);
                        setSelectedStrap(v.strapMaterial);
                        if (v.imageUrls?.[0]) setSelectedImage(v.imageUrls[0]);
                      }}
                      className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                        selectedDial === v.dialColour
                          ? 'border-charcoal bg-charcoal text-pure font-medium'
                          : 'border-platinum hover:border-silver text-graphite'
                      }`}
                    >
                      {v.dialColour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-charcoal block">Quantity</label>
              <div className="flex items-center border border-platinum w-fit rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm hover:bg-porcelain text-charcoal transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 text-sm hover:bg-porcelain text-charcoal transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs: Add to Cart, Buy Now, Wishlist, Compare */}
          <div className="space-y-3 pt-4 border-t border-platinum">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury font-medium hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 bg-pure border border-charcoal text-charcoal text-xs uppercase tracking-luxury font-medium hover:bg-charcoal hover:text-pure transition-colors duration-300"
              >
                Acquire Now
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex-1 py-2.5 border rounded-sm text-xs flex items-center justify-center gap-2 transition-colors ${
                  isFavorited
                    ? 'border-gold text-gold bg-gold/5'
                    : 'border-platinum text-graphite hover:border-charcoal'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                <span>{isFavorited ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => (isCompared ? removeWatch(product.id) : addWatch(product))}
                className={`flex-1 py-2.5 border rounded-sm text-xs flex items-center justify-center gap-2 transition-colors ${
                  isCompared
                    ? 'border-charcoal bg-porcelain text-charcoal font-medium'
                    : 'border-platinum text-graphite hover:border-charcoal'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isCompared ? 'In Comparison' : 'Compare Model'}</span>
              </button>
            </div>
          </div>

          {/* Commercial Trust Pillars */}
          <div className="pt-4 border-t border-platinum space-y-2.5 text-xs text-graphite font-light">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
              <span>5-Year International Mechanical Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Complimentary Armoured Express Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-gold flex-shrink-0" />
              <span>14-Day Complimentary Concierge Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specification Visualizer (SVG Diagrams) */}
      {specs && (
        <section className="bg-ivory border-y border-platinum py-16 my-8">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Measurement Architecture</span>
              <h2 className="font-serif-luxury text-3xl text-charcoal">Case & Movement Dimensions</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {/* Diameter */}
              <div className="bg-pure p-6 rounded-sm border border-platinum space-y-3">
                <svg className="w-20 h-20 mx-auto text-charcoal" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="#0252FC" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="10" cy="50" r="2" fill="#0252FC" />
                  <circle cx="90" cy="50" r="2" fill="#0252FC" />
                </svg>
                <p className="font-serif-luxury text-2xl text-charcoal">{specs.caseDiameterMm} mm</p>
                <p className="text-[10px] uppercase tracking-wider text-silver">Case Diameter</p>
              </div>

              {/* Thickness */}
              <div className="bg-pure p-6 rounded-sm border border-platinum space-y-3">
                <svg className="w-20 h-20 mx-auto text-charcoal" viewBox="0 0 100 100" fill="none">
                  <rect x="25" y="30" width="50" height="40" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="50" y1="30" x2="50" y2="70" stroke="#0252FC" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="50" cy="30" r="2" fill="#0252FC" />
                  <circle cx="50" cy="70" r="2" fill="#0252FC" />
                </svg>
                <p className="font-serif-luxury text-2xl text-charcoal">{specs.caseThicknessMm} mm</p>
                <p className="text-[10px] uppercase tracking-wider text-silver">Case Thickness</p>
              </div>

              {/* Lug to Lug */}
              <div className="bg-pure p-6 rounded-sm border border-platinum space-y-3">
                <svg className="w-20 h-20 mx-auto text-charcoal" viewBox="0 0 100 100" fill="none">
                  <line x1="30" y1="15" x2="70" y2="15" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="30" y1="85" x2="70" y2="85" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="50" y1="15" x2="50" y2="85" stroke="#0252FC" strokeWidth="1" />
                </svg>
                <p className="font-serif-luxury text-2xl text-charcoal">{specs.lugToLugMm} mm</p>
                <p className="text-[10px] uppercase tracking-wider text-silver">Lug-To-Lug Span</p>
              </div>

              {/* Water Resistance */}
              <div className="bg-pure p-6 rounded-sm border border-platinum space-y-3">
                <svg className="w-20 h-20 mx-auto text-charcoal" viewBox="0 0 100 100" fill="none">
                  <path d="M50 20 C50 20 25 55 25 70 A25 25 0 0 0 75 70 C75 55 50 20 50 20 Z" stroke="#0252FC" strokeWidth="1.5" />
                  <text x="50" y="75" textAnchor="middle" fill="#262626" fontSize="12" fontWeight="500">
                    {specs.waterResistanceAtm} ATM
                  </text>
                </svg>
                <p className="font-serif-luxury text-2xl text-charcoal">{specs.waterResistanceMeters} M</p>
                <p className="text-[10px] uppercase tracking-wider text-silver">Water Integrity</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Expandable Master Technical Specification Table */}
      {specs && (
        <section className="max-w-4xl mx-auto px-6 py-10">
          <button
            onClick={() => setSpecsExpanded(!specsExpanded)}
            className="w-full flex items-center justify-between p-6 bg-pure border border-platinum hover:border-charcoal transition-colors rounded-sm"
          >
            <div className="text-left">
              <h3 className="font-serif-luxury text-2xl text-charcoal">Complete Technical Specifications</h3>
              <p className="text-xs text-silver mt-0.5">Explore movement calibration, materials, and horological parameters</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-charcoal transition-transform duration-300 ${specsExpanded ? 'rotate-180' : ''}`} />
          </button>

          {specsExpanded && (
            <div className="bg-pure border-x border-b border-platinum p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
              {/* Movement */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-luxury text-gold font-medium border-b border-platinum pb-1">
                  Movement & Calibre
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-silver block">Type:</span><span className="text-charcoal font-medium">{specs.movementType}</span></div>
                  <div><span className="text-silver block">Calibre:</span><span className="text-charcoal font-medium">{specs.calibre}</span></div>
                  <div><span className="text-silver block">Frequency:</span><span className="text-charcoal font-medium">{specs.frequency}</span></div>
                  <div><span className="text-silver block">Jewels:</span><span className="text-charcoal font-medium">{specs.jewelCount} Jewels</span></div>
                  <div><span className="text-silver block">Power Reserve:</span><span className="text-charcoal font-medium">{specs.powerReserve}</span></div>
                  <div><span className="text-silver block">Accuracy:</span><span className="text-charcoal font-medium">{specs.accuracy}</span></div>
                </div>
              </div>

              {/* Case & Bezel */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-luxury text-gold font-medium border-b border-platinum pb-1">
                  Case & Architecture
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-silver block">Material:</span><span className="text-charcoal font-medium">{specs.caseMaterial}</span></div>
                  <div><span className="text-silver block">Diameter:</span><span className="text-charcoal font-medium">{specs.caseDiameterMm} mm</span></div>
                  <div><span className="text-silver block">Thickness:</span><span className="text-charcoal font-medium">{specs.caseThicknessMm} mm</span></div>
                  <div><span className="text-silver block">Lug-to-Lug:</span><span className="text-charcoal font-medium">{specs.lugToLugMm} mm</span></div>
                  <div><span className="text-silver block">Case Back:</span><span className="text-charcoal font-medium">{specs.caseBackType}</span></div>
                  <div><span className="text-silver block">Crown:</span><span className="text-charcoal font-medium">{specs.crownType}</span></div>
                </div>
              </div>

              {/* Dial & Crystal */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-luxury text-gold font-medium border-b border-platinum pb-1">
                  Dial & Optics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-silver block">Dial Pigment:</span><span className="text-charcoal font-medium">{specs.dialColour}</span></div>
                  <div><span className="text-silver block">Finish:</span><span className="text-charcoal font-medium">{specs.dialFinish}</span></div>
                  <div><span className="text-silver block">Crystal:</span><span className="text-charcoal font-medium">{specs.crystalMaterial}</span></div>
                  <div><span className="text-silver block">Anti-Reflective:</span><span className="text-charcoal font-medium">{specs.antiReflectiveCoating ? 'Yes (Dual Coating)' : 'Standard'}</span></div>
                  <div><span className="text-silver block">Luminescence:</span><span className="text-charcoal font-medium">{specs.luminousIndicators}</span></div>
                </div>
              </div>

              {/* Strap & Clasp */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-luxury text-gold font-medium border-b border-platinum pb-1">
                  Strap & Fit
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-silver block">Material:</span><span className="text-charcoal font-medium">{specs.strapMaterial}</span></div>
                  <div><span className="text-silver block">Lug Width:</span><span className="text-charcoal font-medium">{specs.lugWidthMm} mm</span></div>
                  <div><span className="text-silver block">Clasp:</span><span className="text-charcoal font-medium">{specs.claspType}</span></div>
                  <div><span className="text-silver block">Wrist Range:</span><span className="text-charcoal font-medium">{specs.wristSizeRangeMm ? `${specs.wristSizeRangeMm[0]} - ${specs.wristSizeRangeMm[1]} mm` : '150 - 210 mm'}</span></div>
                  <div><span className="text-silver block">Quick Release:</span><span className="text-charcoal font-medium">{specs.interchangeableStrap ? 'Tool-Free Interchangeable' : 'Standard'}</span></div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Related Timepieces */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-16 border-t border-platinum">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Curated Alternatives</span>
              <h3 className="font-serif-luxury text-3xl text-charcoal">Related in Collection</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-pure/95 border-t border-platinum p-4 z-40 lg:hidden flex items-center justify-between shadow-2xl">
        <div>
          <p className="font-serif-luxury text-lg text-charcoal line-clamp-1">{product.title}</p>
          <p className="text-xs font-medium text-gold">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury font-medium hover:bg-gold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && createPortal(
        <div className="fixed inset-0 z-[120] bg-charcoal/95 flex items-center justify-center p-6">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-2 text-pure hover:text-gold"
          >
            <X className="w-8 h-8" />
          </button>
          <img loading="lazy" decoding="async"
            src={fullscreenImage}
            alt="Fullscreen preview"
            className="w-[min(92vw,85vh)] h-[min(92vw,85vh)] object-contain drop-shadow-2xl"
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductDetailsPage;
