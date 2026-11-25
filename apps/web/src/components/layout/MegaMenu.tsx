import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { sceneArt, watchArt } from '../../lib/images';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const columns = [
  {
    heading: 'Categories',
    links: [
      { label: "Men's Watches", to: '/men' },
      { label: "Women's Watches", to: '/women' },
      { label: 'Unisex Watches', to: '/unisex' },
      { label: 'New Arrivals', to: '/new-arrivals' },
      { label: 'Bestselling Timepieces', to: '/bestsellers' },
      { label: 'Limited Editions (Numbered)', to: '/limited-edition' },
    ],
  },
  {
    heading: 'By Movement',
    links: [
      { label: 'Automatic Self-Winding', to: '/shop?movementType=Automatic' },
      { label: 'Manual-Wind Mechanical', to: '/shop?movementType=Mechanical' },
      { label: 'Meca-Quartz Chronograph', to: '/shop?movementType=Chronograph' },
      { label: 'High-Precision Swiss Quartz', to: '/shop?movementType=Quartz' },
      { label: 'Explore Calibre Craftsmanship', to: '/craftsmanship' },
    ],
  },
  {
    heading: 'Signature Collections',
    links: [
      { label: 'The Classic Collection', to: '/collections/the-classic-collection' },
      { label: 'The Automatic Collection', to: '/collections/the-automatic-collection' },
      { label: 'The Minimal Collection', to: '/collections/the-minimal-collection' },
      { label: 'The Chronograph Collection', to: '/collections/the-chronograph-collection' },
      { label: 'The Signature Collection', to: '/collections/the-signature-collection' },
    ],
  },
];

const spotlights = [
  { image: watchArt('vk-regent-moonphase-41'), name: 'Regent Moonphase 41', to: '/watch/vk-regent-moonphase-41' },
  { image: sceneArt('women'), name: "The Women's Edit", to: '/women' },
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block absolute top-full left-0 w-full bg-pure border-b border-platinum shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] z-50 max-h-[calc(100vh-110px)] overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto px-6 py-9 grid grid-cols-[auto_auto_auto_minmax(0,1fr)] gap-6 xl:gap-10 text-charcoal">
          {columns.map((col, c) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + c * 0.06, duration: 0.4 }}
              className="space-y-4 whitespace-nowrap"
            >
              <p className="text-[10px] uppercase tracking-luxury text-gold-dark font-medium">{col.heading}</p>
              <ul className="space-y-2.5 text-sm font-light">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={onClose}
                      className="group inline-flex items-center gap-1.5 py-0.5 hover:text-gold-dark transition-colors"
                    >
                      <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <div className="grid grid-cols-2 gap-4 pl-6 border-l border-platinum">
            {spotlights.map((s, i) => (
              <motion.div
                key={s.to}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
              >
                <Link to={s.to} onClick={onClose} className="group block">
                  <div className="shine rounded-sm aspect-square bg-porcelain">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="font-serif-luxury text-lg pt-3">{s.name}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-graphite group-hover:text-gold-dark">
                    Discover <ArrowUpRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default MegaMenu;
