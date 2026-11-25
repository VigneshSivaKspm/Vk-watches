import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, SlidersHorizontal, Menu, X, User } from 'lucide-react';
import { VkLogo } from '../common/VkLogo';
import { MegaMenu } from './MegaMenu';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCompareStore } from '../../stores/useCompareStore';
import { useAuthStore } from '../../stores/useAuthStore';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const cartCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.watches.length);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock page scroll behind the mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Shop', path: '/shop', hasMega: true },
    { label: 'Collections', path: '/collections' },
    { label: 'Men', path: '/men' },
    { label: 'Women', path: '/women' },
    { label: 'Craftsmanship', path: '/craftsmanship' },
    { label: 'Finder', path: '/watch-finder' },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-charcoal text-pure text-[11px] tracking-widest uppercase py-2 px-4 text-center font-light border-b border-graphite/30 relative z-50">
        <span>Complimentary Insured Delivery Worldwide &bull; 5-Year Master Horology Warranty</span>
      </div>

      {/* Main Navigation Bar */}
      <header
        onMouseLeave={() => setMegaMenuOpen(false)}
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-pure/95 backdrop-blur-md shadow-subtle py-2.5 border-b border-platinum'
            : 'bg-pure/90 backdrop-blur-sm py-4 border-b border-platinum/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Left Primary Nav (Desktop) */}
          <nav className="hidden lg:flex flex-1 justify-center items-center space-x-5 xl:space-x-7 text-[11px] xl:text-xs uppercase tracking-widest xl:tracking-luxury font-normal text-charcoal">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative group py-2"
                onMouseEnter={() => setMegaMenuOpen(Boolean(link.hasMega))}
              >
                <Link
                  to={link.path}
                  className={`transition-colors duration-200 hover:text-gold ${
                    location.pathname === link.path ? 'text-gold font-medium' : ''
                  }`}
                >
                  {link.label}
                </Link>
                {/* Watch-hand animated fine underline */}
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-300 ease-out ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </div>
            ))}
          </nav>

          {/* Center Brand Identity Logo */}
          <div className="flex-shrink-0 flex items-center justify-center lg:order-first">
            <VkLogo size={isScrolled ? 'md' : 'lg'} />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-charcoal">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 hover:text-gold transition-colors"
              aria-label="Search Timepieces"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Compare */}
            <Link
              to="/compare"
              className="p-1.5 hover:text-gold transition-colors relative hidden sm:block"
              aria-label="Compare Timepieces"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-charcoal text-pure text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-1.5 hover:text-gold transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-pure text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="p-1.5 hover:text-gold transition-colors"
              aria-label="Customer Account"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Shopping Bag with animated count */}
            <button
              onClick={toggleCart}
              className="p-1.5 hover:text-gold transition-colors relative flex items-center"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-charcoal text-pure text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
      {/* Mobile Fullscreen Animated Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full h-[calc(100dvh-100%)] bg-pure z-50 overflow-y-auto px-6 py-8 flex flex-col justify-between gap-8 border-t border-platinum lg:hidden">
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-ultra text-silver">Menu</p>
            <nav className="flex flex-col space-y-4 text-base tracking-wider uppercase font-light text-charcoal">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 border-b border-platinum/50 flex justify-between items-center hover:text-gold"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link
                to="/journal"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 border-b border-platinum/50 flex justify-between items-center hover:text-gold"
              >
                <span>Journal</span>
              </Link>
              <Link
                to="/size-guide"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 border-b border-platinum/50 flex justify-between items-center hover:text-gold"
              >
                <span>Size Guide</span>
              </Link>
              <Link
                to="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 border-b border-platinum/50 flex justify-between items-center hover:text-gold"
              >
                <span>Compare Watches ({compareCount})</span>
              </Link>
            </nav>
          </div>

          <div className="pt-8 border-t border-platinum space-y-4">
            <div className="flex items-center justify-between text-xs text-silver">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Concierge Contact</Link>
              <Link to="/track-order" onClick={() => setMobileMenuOpen(false)}>Order Tracking</Link>
            </div>
            <div className="text-[11px] text-graphite text-center">
              VK TIME &bull; Geneva &bull; Mumbai &bull; London
            </div>
          </div>
        </div>
      )}
      </header>

    </>
  );
};

export default Navbar;
