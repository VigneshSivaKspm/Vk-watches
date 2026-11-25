import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { WatchProduct } from '@vk-time/shared';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WatchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiRequest<{ products: WatchProduct[] }>(`/products?search=${encodeURIComponent(query)}&limit=4`);
        setResults(res.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-charcoal/50 transition-opacity" />

      <div className="relative min-h-screen px-4 flex items-start justify-center pt-24 sm:pt-32">
        <div className="relative w-full max-w-2xl bg-pure shadow-2xl rounded-sm border border-platinum p-6 sm:p-8 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center pb-4 border-b border-platinum">
            <span className="text-[10px] uppercase tracking-ultra text-silver">Search Watch Catalog</span>
            <button onClick={onClose} className="p-1 hover:text-gold text-charcoal">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-3 py-4 border-b border-charcoal/30">
            <Search className="w-5 h-5 text-silver" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by collection, movement, or reference..."
              className="w-full text-base font-light text-charcoal focus:outline-none placeholder:text-silver bg-transparent"
            />
            {loading && <span className="text-xs text-silver animate-pulse">Searching...</span>}
          </form>

          {/* Quick suggestions */}
          {!query && (
            <div className="pt-6 space-y-3">
              <p className="text-[10px] uppercase tracking-luxury text-silver">Popular Inquiries</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Automatic 40mm', 'Chronograph', 'Minimalist', 'Sapphire Crystal', 'Limited Edition'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-porcelain hover:bg-platinum text-charcoal rounded-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results Preview */}
          {results.length > 0 && (
            <div className="pt-6 space-y-4">
              <p className="text-[10px] uppercase tracking-luxury text-silver">Timepieces Found</p>
              <div className="space-y-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/watch/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 hover:bg-porcelain rounded-sm transition-colors group"
                  >
                    <img loading="lazy" decoding="async"
                      src={product.primaryImage}
                      alt={product.title}
                      className="w-12 h-12 object-cover bg-white rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal group-hover:text-gold truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-silver">
                        {product.movementType} &bull; {product.caseDiameterMm}mm &bull; ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-silver group-hover:text-charcoal transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full text-center text-xs uppercase tracking-wider text-charcoal hover:text-gold pt-2 underline underline-offset-4"
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
