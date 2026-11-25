import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { WatchCollection, WatchProduct } from '@vk-time/shared';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';

export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<(WatchCollection & { products: WatchProduct[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await apiRequest(`/collections/${slug}`);
        setCollection(data);
      } catch (err) {
        console.error('Failed to load collection:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-xs text-silver">Accessing Collection...</div>;
  }

  if (!collection) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="font-serif-luxury text-3xl text-charcoal">Collection Not Found</h2>
        <Link to="/collections" className="text-xs uppercase tracking-luxury text-gold underline">
          Return to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero Banner */}
      <PageHero
        eyebrow={collection.aestheticTone}
        title={collection.name}
        description={collection.description}
        quote={collection.accentQuote}
        image={collection.heroImage}
      />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collection.products?.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08} className="flex flex-col">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailPage;
