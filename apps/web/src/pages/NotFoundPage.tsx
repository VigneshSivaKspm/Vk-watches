import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LiveWatch } from '../components/common/LiveWatch';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-6 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Clock-inspired animated watch hand visual */}
        <div className="relative w-52 h-52 mx-auto rounded-full overflow-hidden shadow-luxe-hover border-2 border-gold/50 animate-float">
          <LiveWatch slug="vk-heritage-automatic-39" view="macro" className="absolute inset-0" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Error 404</span>
          <h1 className="font-serif-luxury text-4xl text-charcoal">
            Lost in Time
          </h1>
          <p className="text-xs text-graphite font-light leading-relaxed">
            The page or reference you are seeking has slipped through the escapement wheel into the past.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
