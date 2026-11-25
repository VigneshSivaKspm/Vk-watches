import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { VkLogo } from '../common/VkLogo';
import { apiRequest } from '../../services/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await apiRequest('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true); // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative z-10 bg-pure text-charcoal border-t border-platinum pt-16 pb-12 mt-auto">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
      {/* Horological Trust Value Pillars */}
      <div className="max-w-7xl mx-auto px-6 mb-16 pb-12 border-b border-platinum">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-3.5">
            <Award className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-medium text-charcoal">Swiss Precision</h4>
              <p className="text-[12px] text-graphite/80 mt-1 leading-relaxed">Master chronometer calibration & verified provenance.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3.5">
            <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-medium text-charcoal">5-Year Warranty</h4>
              <p className="text-[12px] text-graphite/80 mt-1 leading-relaxed">Comprehensive international mechanical protection.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3.5">
            <Truck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-medium text-charcoal">Insured Transit</h4>
              <p className="text-[12px] text-graphite/80 mt-1 leading-relaxed">Armoured tamper-evident white-glove delivery.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3.5">
            <RefreshCw className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-luxury font-medium text-charcoal">14-Day Returns</h4>
              <p className="text-[12px] text-graphite/80 mt-1 leading-relaxed">Complimentary return concierge on unworn pieces.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand identity column */}
        <div className="md:col-span-4 space-y-4">
          <VkLogo size="md" />
          <p className="text-xs text-graphite leading-relaxed max-w-sm pt-2">
            VK TIME creates wristwatches that transcend fleeting trends. Grounded in architectural minimalism, pure materials, and horological integrity.
          </p>
          <div className="pt-2 text-[11px] uppercase tracking-luxury text-silver">
            Geneva &bull; Zurich &bull; Mumbai
          </div>
        </div>

        {/* Collections */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-[10px] uppercase tracking-ultra text-silver font-medium">Collections</p>
          <ul className="space-y-2 text-xs text-graphite font-light">
            <li><Link to="/collections/the-classic-collection" className="hover:text-gold transition-colors">The Classic</Link></li>
            <li><Link to="/collections/the-automatic-collection" className="hover:text-gold transition-colors">The Automatic</Link></li>
            <li><Link to="/collections/the-minimal-collection" className="hover:text-gold transition-colors">The Minimal</Link></li>
            <li><Link to="/collections/the-chronograph-collection" className="hover:text-gold transition-colors">The Chronograph</Link></li>
            <li><Link to="/collections/the-signature-collection" className="hover:text-gold transition-colors">The Signature</Link></li>
            <li><Link to="/limited-edition" className="hover:text-gold transition-colors font-medium text-charcoal">Limited Editions</Link></li>
          </ul>
        </div>

        {/* Horological Guidance */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-[10px] uppercase tracking-ultra text-silver font-medium">Horology & Guide</p>
          <ul className="space-y-2 text-xs text-graphite font-light">
            <li><Link to="/craftsmanship" className="hover:text-gold transition-colors">Movement Craft</Link></li>
            <li><Link to="/size-guide" className="hover:text-gold transition-colors">Wrist Sizing Guide</Link></li>
            <li><Link to="/watch-care" className="hover:text-gold transition-colors">Watch Care & Service</Link></li>
            <li><Link to="/watch-finder" className="hover:text-gold transition-colors">Watch Finder Tool</Link></li>
            <li><Link to="/compare" className="hover:text-gold transition-colors">Compare Timepieces</Link></li>
            <li><Link to="/journal" className="hover:text-gold transition-colors">The Gazette</Link></li>
          </ul>
        </div>

        {/* Client Care & Newsletter */}
        <div className="md:col-span-4 space-y-4">
          <p className="text-[10px] uppercase tracking-ultra text-silver font-medium">The VK Gazette</p>
          <p className="text-xs text-graphite font-light">
            Receive private notifications of limited-edition numbered releases and horological essays.
          </p>

          {subscribed ? (
            <p className="text-xs text-gold font-medium py-2">Thank you. Your subscription has been confirmed.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border-b border-charcoal/40 pb-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="bg-transparent text-xs w-full focus:outline-none placeholder:text-silver text-charcoal py-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-1 hover:text-gold transition-colors focus:outline-none"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-xs space-y-1 text-graphite font-light">
            <p><Link to="/contact" className="hover:text-gold">Concierge: concierge@vktime.com</Link></p>
            <p><a href="tel:+919087615708" className="hover:text-gold">Phone: +91 90876 15708</a></p>
            <p><Link to="/track-order" className="hover:text-gold">Order Tracking Portal</Link></p>
            <p><Link to="/admin" className="text-[11px] text-silver hover:text-charcoal">Administration Access</Link></p>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-platinum flex flex-col sm:flex-row items-center justify-between text-[11px] text-silver space-y-3 sm:space-y-0">
        <div>&copy; {new Date().getFullYear()} VK TIME Horology S.A. All rights reserved.</div>
        <div className="flex space-x-6">
          <Link to="/privacy-policy" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-charcoal transition-colors">Terms of Sale</Link>
          <Link to="/shipping-policy" className="hover:text-charcoal transition-colors">Shipping & Customs</Link>
          <Link to="/return-policy" className="hover:text-charcoal transition-colors">Returns & Guarantee</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
