import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal, Compass } from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { CollectionsEditorial } from '../components/home/CollectionsEditorial';
import { AnatomyOfPrecision } from '../components/home/AnatomyOfPrecision';
import { MovementEngineering } from '../components/home/MovementEngineering';
import { OccasionSection } from '../components/home/OccasionSection';
import { ProductCard } from '../components/product/ProductCard';
import { Reveal } from '../components/common/Reveal';
import { LiveWatch } from '../components/common/LiveWatch';
import { Ribbon, GenderShowcase, WatchGallery, AtelierPromise } from '../components/home/Showcase';
import { apiRequest } from '../services/api';
import { sceneArt } from '../lib/images';
import { WatchProduct, JournalArticle } from '@vk-time/shared';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<WatchProduct[]>([]);
  const [journalTeasers, setJournalTeasers] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodRes, journalRes] = await Promise.all([
          apiRequest<{ products: WatchProduct[] }>('/products?isFeatured=true&limit=8'),
          apiRequest<JournalArticle[]>('/journal'),
        ]);
        setFeaturedProducts(prodRes.products || []);
        setJournalTeasers((journalRes || []).slice(0, 3));
      } catch (e) {
        console.error('Error loading home data', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="w-full">
      {/* 01. Cinematic Hero */}
      <HeroSection />
      <Ribbon />

      {/* 02. Signature Collections Editorial */}
      <CollectionsEditorial />

      {/* 03. Featured Timepieces Grid */}
      <section className="py-24 bg-pure/60 border-t border-platinum">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Curated Gallery</span>
              <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal">
                Featured Timepieces
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-luxury text-charcoal hover:text-gold flex items-center gap-1.5 underline underline-offset-4"
            >
              <span>Explore All Watches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-sm bg-porcelain animate-pulse" />
              ))}
            {featuredProducts.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 0.08} className="flex flex-col">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04. Anatomy of Precision (Interactive Technical Hotspots) */}
      <AnatomyOfPrecision />

      {/* 05. Men's, Women's and Unisex Lifestyle Tiles */}
      <GenderShowcase />

      {/* 06. Movement & Calibres Engineering */}
      <MovementEngineering />

      {/* 07. Signature Product Spotlight */}
      <section className="py-24 bg-pure/60 border-t border-platinum overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <Reveal x={-40} y={0} className="lg:col-span-6">
            <div className="relative aspect-square rounded-sm overflow-hidden shadow-luxe-hover bg-[#141312]">
              <LiveWatch slug="vk-chronos-skeleton-limited-41" view="macro" className="absolute inset-0" />
              <span className="absolute left-4 bottom-4 text-[9px] uppercase tracking-ultra text-gold-light bg-black/60 px-3 py-1.5 rounded-sm">
                Live Calibre &bull; Real Time
              </span>
            </div>
          </Reveal>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Spotlight Masterpiece</span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal leading-tight">
              Chronos Skeleton <br />
              <span className="italic font-normal">Numbered Edition of 300</span>
            </h2>
            <p className="text-sm text-graphite font-light leading-relaxed">
              Every bridge of the manual-wind Calibre VK-900 is open to view through dual anti-reflective sapphire crystals. Hand-chamfered anglage bevels reflect light in every angle, creating an architectural masterpiece on the wrist.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-platinum text-xs">
              <div>
                <p className="text-silver">Calibre</p>
                <p className="font-medium text-charcoal">VK-900 Manual</p>
              </div>
              <div>
                <p className="text-silver">Power Reserve</p>
                <p className="font-medium text-charcoal">56 Hours</p>
              </div>
              <div>
                <p className="text-silver">Case Material</p>
                <p className="font-medium text-charcoal">904L Oystersteel</p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <span className="font-serif-luxury text-2xl text-charcoal">₹89,000</span>
              <Link
                to="/watch/vk-chronos-skeleton-limited-41"
                className="px-8 py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors duration-300"
              >
                Inspect Reference
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 08. Shop by Occasion */}
      <OccasionSection />
      <WatchGallery />

      {/* 09. Interactive Tools Banner (Watch Finder & Size Guide) */}
      <section className="relative py-24 bg-[#141312] text-pure overflow-hidden">
        <img src={sceneArt('hero-automatic')} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-8 border border-gold/30 rounded-sm space-y-4 bg-charcoal/70 backdrop-blur-md hover:-translate-y-1 transition-transform">
            <Compass className="w-6 h-6 text-gold" />
            <h3 className="font-serif-luxury text-2xl sm:text-3xl">Personalised Watch Finder</h3>
            <p className="text-xs text-pure/70 leading-relaxed font-light">
              Answer 7 curated questions to discover the exact timepiece tailored to your wrist anatomy, aesthetic taste, and occasion.
            </p>
            <Link
              to="/watch-finder"
              className="inline-block pt-2 text-xs uppercase tracking-wider text-gold hover:text-pure underline underline-offset-4"
            >
              Launch Watch Finder Quiz &rarr;
            </Link>
          </div>

          <div className="p-8 border border-gold/30 rounded-sm space-y-4 bg-charcoal/70 backdrop-blur-md hover:-translate-y-1 transition-transform">
            <SlidersHorizontal className="w-6 h-6 text-gold" />
            <h3 className="font-serif-luxury text-2xl sm:text-3xl">Interactive Watch Size Guide</h3>
            <p className="text-xs text-pure/70 leading-relaxed font-light">
              Use our interactive wrist-slider to visualize how 34mm, 38mm, 40mm, and 42mm cases sit on different wrist circumferences.
            </p>
            <Link
              to="/size-guide"
              className="inline-block pt-2 text-xs uppercase tracking-wider text-gold hover:text-pure underline underline-offset-4"
            >
              Explore Sizing Guide &rarr;
            </Link>
          </div>
        </div>
      </section>

      <AtelierPromise />

      {/* 10. The VK Gazette / Watch Journal */}
      <section className="py-24 bg-pure/60 border-t border-platinum">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Horological Journal</span>
              <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal">
                The VK Gazette
              </h2>
            </div>
            <Link
              to="/journal"
              className="text-xs uppercase tracking-luxury text-charcoal hover:text-gold flex items-center gap-1.5 underline underline-offset-4"
            >
              <span>Read All Essays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journalTeasers.map((article) => (
              <Link
                key={article.id}
                to={`/journal/${article.slug}`}
                className="group flex flex-col space-y-4"
              >
                <div className="overflow-hidden rounded-sm aspect-[16/10] bg-porcelain">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-ultra text-gold font-medium">{article.category}</span>
                  <h3 className="font-serif-luxury text-xl text-charcoal group-hover:text-gold transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-graphite/80 line-clamp-2 font-light">
                    {article.excerpt}
                  </p>
                  <p className="text-[11px] text-silver pt-1">
                    {article.readingTimeMinutes} min read &bull; By {article.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
