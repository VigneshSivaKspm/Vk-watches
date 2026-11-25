import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, Grid, List, X, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { apiRequest } from '../services/api';
import { WatchProduct } from '@vk-time/shared';
import { PageHero } from '../components/common/PageHero';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<WatchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<WatchProduct | null>(null);

  // Active filter state from URL
  const selectedGender = searchParams.get('gender') || 'All';
  const selectedMovement = searchParams.get('movementType') || 'All';
  const selectedCollection = searchParams.get('collection') || 'All';
  const selectedSort = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        if (selectedGender === 'All') queryParams.delete('gender');
        if (selectedMovement === 'All') queryParams.delete('movementType');
        if (selectedCollection === 'All') queryParams.delete('collection');

        const res = await apiRequest<{ products: WatchProduct[]; totalCount: number }>(
          `/products?${queryParams.toString()}`
        );
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load shop catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const updated = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      updated.delete(key);
    } else {
      updated.set(key, value);
    }
    setSearchParams(updated);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    selectedGender !== 'All' ||
    selectedMovement !== 'All' ||
    selectedCollection !== 'All' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    searchQuery !== '';

  return (
    <div className="w-full min-h-screen">
      {/* Editorial Banner */}
      <PageHero
          eyebrow="Horological Catalogue"
          title="The Complete Timepiece Collection"
          description="Every VK TIME watch is assembled to strict chronometric standards. Filter by calibre, collection and complication."
          image="/images/scenes/hero-automatic.svg"
        />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Bar */}
        <div className="bg-pure border border-platinum p-4 rounded-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen((open) => !open)}
              aria-expanded={mobileFilterOpen}
              className="lg:hidden px-3 py-1.5 border border-platinum text-xs flex items-center gap-2 hover:bg-porcelain"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            <span className="text-xs text-silver">
              Showing <strong className="text-charcoal">{products.length}</strong> timepiece reference(s)
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sorting */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-silver hidden sm:inline">Sort:</span>
              <select
                value={selectedSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-pure border border-platinum px-3 py-1.5 text-xs text-charcoal focus:outline-none rounded-sm"
              >
                <option value="featured">Curated & Featured</option>
                <option value="newest">New Releases</option>
                <option value="bestsellers">Bestselling Timepieces</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Grid / List View Mode */}
            <div className="hidden sm:flex border border-platinum rounded-sm overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-charcoal text-pure' : 'bg-pure text-charcoal hover:bg-porcelain'}`}
                aria-label="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-charcoal text-pure' : 'bg-pure text-charcoal hover:bg-porcelain'}`}
                aria-label="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside
            className={`${mobileFilterOpen ? 'block' : 'hidden'} lg:block lg:col-span-3 space-y-6 bg-pure p-6 rounded-sm border border-platinum h-fit`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-platinum">
              <span className="text-xs uppercase tracking-luxury font-medium text-charcoal">Filters</span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-gold hover:text-charcoal flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <div className="space-y-2.5 pb-4 border-b border-platinum">
              <p className="text-[10px] uppercase tracking-ultra text-silver font-medium">Gender</p>
              {['All', 'Men', 'Women', 'Unisex'].map((g) => (
                <label key={g} className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={selectedGender === g}
                    onChange={() => updateFilter('gender', g)}
                    className="accent-charcoal"
                  />
                  <span>{g === 'All' ? 'All Proportions' : g === 'Unisex' ? 'Unisex Watches' : `${g}'s Watches`}</span>
                </label>
              ))}
            </div>

            {/* Movement Filter */}
            <div className="space-y-2.5 pb-4 border-b border-platinum">
              <p className="text-[10px] uppercase tracking-ultra text-silver font-medium">Movement Type</p>
              {['All', 'Automatic', 'Mechanical', 'Chronograph', 'Quartz'].map((m) => (
                <label key={m} className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                  <input
                    type="radio"
                    name="movement"
                    checked={selectedMovement === m}
                    onChange={() => updateFilter('movementType', m)}
                    className="accent-charcoal"
                  />
                  <span>{m === 'All' ? 'All Calibres' : m}</span>
                </label>
              ))}
            </div>

            {/* Collection Filter */}
            <div className="space-y-2.5 pb-4 border-b border-platinum">
              <p className="text-[10px] uppercase tracking-ultra text-silver font-medium">Collection</p>
              {[
                { label: 'All Collections', value: 'All' },
                { label: 'The Classic Collection', value: 'the-classic-collection' },
                { label: 'The Automatic Collection', value: 'the-automatic-collection' },
                { label: 'The Minimal Collection', value: 'the-minimal-collection' },
                { label: 'The Chronograph Collection', value: 'the-chronograph-collection' },
                { label: 'The Signature Collection', value: 'the-signature-collection' },
              ].map((c) => (
                <label key={c.value} className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                  <input
                    type="radio"
                    name="collection"
                    checked={selectedCollection === c.value}
                    onChange={() => updateFilter('collection', c.value)}
                    className="accent-charcoal"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-ultra text-silver font-medium">Price Range (INR)</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="p-1.5 border border-platinum bg-porcelain rounded-sm focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="p-1.5 border border-platinum bg-porcelain rounded-sm focus:outline-none"
                />
              </div>
            </div>
          </aside>

          {/* Product Grid / List */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-96 bg-pure border border-platinum rounded-sm animate-pulse p-4 space-y-4">
                    <div className="aspect-square bg-porcelain rounded-sm" />
                    <div className="h-4 bg-porcelain rounded w-3/4" />
                    <div className="h-3 bg-porcelain rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-pure border border-platinum rounded-sm p-8 space-y-4">
                <h3 className="font-serif-luxury text-2xl text-charcoal">No Timepieces Match Your Filters</h3>
                <p className="text-xs text-graphite max-w-md mx-auto">
                  Try broadening your price range, movement calibre, or gender selection to view available models.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col space-y-4'
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && createPortal(
        <div className="fixed inset-0 z-[120] overflow-y-auto">
          <div onClick={() => setQuickViewProduct(null)} className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" />
          <div className="relative min-h-screen px-4 flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-pure rounded-sm shadow-2xl border border-platinum p-6 sm:p-8 animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-1 text-silver hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <img
                  src={quickViewProduct.primaryImage}
                  alt={quickViewProduct.title}
                  className="w-full aspect-square object-cover bg-porcelain rounded-sm"
                />
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">
                      {quickViewProduct.movementType} &bull; {quickViewProduct.caseDiameterMm}mm
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-charcoal">{quickViewProduct.title}</h3>
                    <p className="text-xs text-silver mt-1">{quickViewProduct.subtitle}</p>
                  </div>
                  <p className="text-xs text-graphite leading-relaxed">{quickViewProduct.shortDescription}</p>
                  <p className="font-serif-luxury text-2xl text-charcoal">
                    ₹{quickViewProduct.price.toLocaleString('en-IN')}
                  </p>
                  <div className="pt-2 flex gap-3">
                    <Link
                      to={`/watch/${quickViewProduct.slug}`}
                      className="flex-1 py-3 bg-charcoal text-pure text-center text-xs uppercase tracking-luxury hover:bg-gold transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ShopPage;
