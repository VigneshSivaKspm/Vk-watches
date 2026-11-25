import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { JournalArticle } from '@vk-time/shared';
import { PageHero } from '../components/common/PageHero';

export const JournalPage: React.FC = () => {
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJournal() {
      try {
        const data = await apiRequest<JournalArticle[]>('/journal');
        setArticles(data || []);
      } catch (err) {
        console.error('Failed to load journal:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJournal();
  }, []);

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <PageHero
          eyebrow="The VK Gazette"
          title="Horological Essays & Perspectives"
          description="Explorations into mechanical calibres, case ergonomics and materials science from our watchmakers and curators."
          image="/images/scenes/banner-journal.svg"
        />

        {loading ? (
          <div className="text-center py-20 text-xs text-silver">Loading Gazette...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/journal/${article.slug}`}
                className="group bg-pure border border-platinum rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-luxe-hover transition-all duration-500"
              >
                <div className="aspect-[16/10] overflow-hidden bg-porcelain">
                  <img loading="lazy" decoding="async"
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-ultra text-gold font-medium">
                      {article.category}
                    </span>
                    <h2 className="font-serif-luxury text-xl text-charcoal group-hover:text-gold transition-colors leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-xs text-graphite/80 font-light line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-platinum/60 flex justify-between items-center text-[11px] text-silver font-light">
                    <span>{article.author}</span>
                    <span>{article.readingTimeMinutes} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
