import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import { apiRequest } from '../services/api';
import { JournalArticle } from '@vk-time/shared';

export const JournalArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<JournalArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      try {
        const data = await apiRequest<JournalArticle>(`/journal/${slug}`);
        setArticle(data);
      } catch (e) {
        console.error('Failed to load article:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-24 text-xs text-silver">Loading Article...</div>;
  }

  if (!article) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="font-serif-luxury text-2xl text-charcoal">Article Not Found</h2>
        <Link to="/journal" className="text-xs uppercase tracking-wider text-gold underline">Return to Gazette</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-pure text-charcoal py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto space-y-8">
        <Link to="/journal" className="inline-flex items-center gap-2 text-xs text-silver hover:text-charcoal transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gazette</span>
        </Link>

        <div className="space-y-4 text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">
            {article.category}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-silver pt-2 border-b border-platinum pb-6">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readingTimeMinutes} min read</span>
            <span>&bull;</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="aspect-[16/9] overflow-hidden rounded-sm bg-porcelain">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-neutral max-w-none text-graphite text-sm sm:text-base leading-relaxed font-light space-y-6 pt-4">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="pt-8 border-t border-platinum flex flex-wrap gap-2 text-xs">
            {article.tags.map((t, idx) => (
              <span key={idx} className="px-3 py-1 bg-porcelain text-charcoal rounded-sm">
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
};

export default JournalArticlePage;
