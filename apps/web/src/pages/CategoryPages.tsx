import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { WatchProduct } from '@vk-time/shared';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';

interface CategoryViewProps {
  title: string;
  subtitle: string;
  description: string;
  queryParam: string;
  image: string;
}

export const CategoryPageTemplate: React.FC<CategoryViewProps> = ({
  title,
  subtitle,
  description,
  queryParam,
  image,
}) => {
  const [products, setProducts] = useState<WatchProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function loadCategory() {
      try {
        const res = await apiRequest<{ products: WatchProduct[] }>(`/products?${queryParam}`);
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [queryParam]);

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <PageHero eyebrow={subtitle} title={title} description={description} image={image} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-sm bg-porcelain animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-sm text-graphite">No current models available in this series.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.08} className="flex flex-col">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MenPage = () => (
  <CategoryPageTemplate
    title="Men's Timepieces"
    subtitle="Commanding Proportions"
    description="Engineered in 39mm, 40mm, and 42mm configurations with high-beat automatic movements and ceramic tachymeter bezels."
    image="/images/scenes/banner-men.svg"
    queryParam="gender=Men"
  />
);

export const WomenPage = () => (
  <CategoryPageTemplate
    title="Women's Timepieces"
    subtitle="Poetic Fluidity"
    description="Slender 34mm cases, iridescent natural mother-of-pearl dials, and champagne gold PVD finishing."
    image="/images/scenes/banner-women.svg"
    queryParam="gender=Women"
  />
);

export const UnisexPage = () => (
  <CategoryPageTemplate
    title="Unisex Timepieces"
    subtitle="Universal Balance"
    description="Balanced 38mm and 40mm profiles designed around golden ratio symmetry to flatter any wrist."
    image="/images/scenes/banner-unisex.svg"
    queryParam="gender=Unisex"
  />
);

export const NewArrivalsPage = () => (
  <CategoryPageTemplate
    title="New Releases"
    subtitle="Latest Horology"
    description="The most recent references to emerge from our master watchmaking ateliers."
    image="/images/scenes/hero-chronograph.svg"
    queryParam="isNewArrival=true"
  />
);

export const BestsellersPage = () => (
  <CategoryPageTemplate
    title="Signature Bestsellers"
    subtitle="Celebrated Icons"
    description="Our most acquired references, celebrated by connoisseurs for balanced design and chronometer reliability."
    image="/images/scenes/hero-automatic.svg"
    queryParam="isBestseller=true"
  />
);

export const LimitedEditionPage = () => (
  <CategoryPageTemplate
    title="Limited & Numbered Editions"
    subtitle="Rare Horological Artifacts"
    description="Strictly limited to numbered production runs. Each piece comes with a signed certificate of limitation."
    image="/images/scenes/hero-signature.svg"
    queryParam="isLimitedEdition=true"
  />
);

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  return (
    <CategoryPageTemplate
      title={`Search Results for "${q}"`}
      subtitle="Catalog Inquiry"
      description={`Displaying all timepiece references matching "${q}".`}
      image="/images/scenes/hero-classic.svg"
      queryParam={`search=${encodeURIComponent(q)}`}
    />
  );
};
