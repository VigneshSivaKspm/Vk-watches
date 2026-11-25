import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { apiRequest } from '../services/api';
import { WatchCollection } from '@vk-time/shared';
import { PageHero } from '../components/common/PageHero';

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<WatchCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await apiRequest<WatchCollection[]>('/collections');
        setCollections(data || []);
      } catch (err) {
        console.error('Error loading collections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <PageHero
          eyebrow="Curated Series"
          title="The Signature Collections"
          description="Every collection explores a distinct horological thesis: from kinetic high-beat self-winding engines to monolithic architectural reduction."
          image="/images/scenes/hero-signature.svg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((c) => (
            <Link
              key={c.id}
              to={`/collections/${c.slug}`}
              className="group shine aspect-[16/10] md:[&:last-child:nth-child(odd)]:col-span-2 md:[&:last-child:nth-child(odd)]:aspect-[32/11] bg-porcelain rounded-sm overflow-hidden flex flex-col justify-end p-8 border border-platinum hover:shadow-luxe-hover transition-all duration-700"
            >
              <img loading="lazy" decoding="async"
                src={c.heroImage}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

              <div className="relative z-10 text-pure space-y-2">
                <span className="text-[9px] uppercase tracking-ultra text-gold-light font-medium">
                  {c.aestheticTone} &bull; {c.productCount} References
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-pure">{c.name}</h2>
                <p className="text-xs text-pure/80 font-light max-w-md line-clamp-2">{c.description}</p>
                <div className="pt-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-pure group-hover:text-gold-light transition-colors">
                  <span>Enter Collection</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
