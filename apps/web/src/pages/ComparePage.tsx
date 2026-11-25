import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Check, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { useCompareStore } from '../stores/useCompareStore';
import { useCartStore } from '../stores/useCartStore';

export const ComparePage: React.FC = () => {
  const { watches, removeWatch, clearCompare } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const specRows = [
    { label: 'Price', key: 'price', format: (w: any) => `₹${w.price.toLocaleString('en-IN')}` },
    { label: 'Collection', key: 'collectionName', format: (w: any) => w.collectionName || 'Signature' },
    { label: 'Gender', key: 'gender', format: (w: any) => w.gender },
    { label: 'Movement Calibre', key: 'movement', format: (w: any) => `${w.movementType} (${w.specifications?.calibre || 'Proprietary'})` },
    { label: 'Case Diameter', key: 'diameter', format: (w: any) => `${w.caseDiameterMm} mm` },
    { label: 'Case Thickness', key: 'thickness', format: (w: any) => `${w.specifications?.caseThicknessMm || 10.4} mm` },
    { label: 'Case Material', key: 'caseMat', format: (w: any) => w.specifications?.caseMaterial || '316L Stainless Steel' },
    { label: 'Crystal Glass', key: 'crystal', format: (w: any) => w.specifications?.crystalMaterial || 'Sapphire Crystal' },
    { label: 'Dial Finish', key: 'dialFinish', format: (w: any) => w.specifications?.dialFinish || 'Sunburst Brushed' },
    { label: 'Strap Material', key: 'strapMat', format: (w: any) => w.specifications?.strapMaterial || 'Italian Leather' },
    { label: 'Water Resistance', key: 'waterRes', format: (w: any) => `${w.specifications?.waterResistanceAtm || 5} ATM (${w.specifications?.waterResistanceMeters || 50}M)` },
    { label: 'Power Reserve', key: 'powerRes', format: (w: any) => w.specifications?.powerReserve || '42 Hours' },
    { label: 'Warranty Duration', key: 'warranty', format: (w: any) => `${w.specifications?.warrantyYears || 3} Years International` },
  ];

  if (watches.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4 min-h-[60vh] flex flex-col items-center justify-center">
        <SlidersHorizontal className="w-12 h-12 text-silver mx-auto" />
        <h2 className="font-serif-luxury text-3xl text-charcoal">Timepiece Comparison Matrix</h2>
        <p className="text-xs text-graphite max-w-md">
          You have not selected any watches to compare. Browse our catalog and click the comparison icon on any watch card.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors"
        >
          Explore Watch Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header and Toggle Controls */}
        <div className="bg-pure p-6 rounded-sm border border-platinum flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Horological Comparison</span>
            <h1 className="font-serif-luxury text-3xl text-charcoal">Side-by-Side Model Analysis</h1>
            <p className="text-xs text-silver mt-1">Comparing {watches.length} of 4 maximum timepieces</p>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDiffOnly}
                onChange={(e) => setShowDiffOnly(e.target.checked)}
                className="accent-charcoal w-4 h-4"
              />
              <span className="font-medium">Show differences only</span>
            </label>

            <button
              onClick={clearCompare}
              className="text-xs text-silver hover:text-red-500 transition-colors"
            >
              Clear Comparison
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-pure border border-platinum rounded-sm overflow-x-auto shadow-subtle">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-platinum bg-ivory/50">
                <th className="p-4 sm:p-6 w-1/4 text-xs uppercase tracking-luxury text-silver font-medium">
                  Watch Model
                </th>
                {watches.map((watch) => (
                  <th key={watch.id} className="p-4 sm:p-6 w-1/4 align-top relative">
                    <button
                      onClick={() => removeWatch(watch.id)}
                      className="absolute top-4 right-4 text-silver hover:text-charcoal p-1"
                      aria-label="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      <img loading="lazy" decoding="async"
                        src={watch.primaryImage}
                        alt={watch.title}
                        className="w-28 h-28 object-contain mx-auto bg-porcelain rounded-sm p-2"
                      />
                      <Link
                        to={`/watch/${watch.slug}`}
                        className="font-serif-luxury text-lg text-charcoal hover:text-gold block leading-tight line-clamp-1"
                      >
                        {watch.title}
                      </Link>
                      <p className="text-xs font-serif-luxury text-charcoal">
                        ₹{watch.price.toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => addItem(watch)}
                        className="w-full py-2 bg-charcoal text-pure text-[10px] uppercase tracking-wider font-medium hover:bg-gold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </th>
                ))}
                {/* Empty slot placeholder if less than 4 */}
                {watches.length < 4 && (
                  <th className="p-4 sm:p-6 w-1/4 align-middle text-center bg-porcelain/30 border-l border-platinum">
                    <Link
                      to="/shop"
                      className="inline-flex flex-col items-center justify-center p-6 border-2 border-dashed border-platinum rounded-sm hover:border-charcoal text-silver hover:text-charcoal transition-colors group"
                    >
                      <Plus className="w-6 h-6 mb-1 text-gold" />
                      <span className="text-xs uppercase tracking-wider">Add Watch</span>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-platinum text-xs">
              {specRows.map((row, i) => {
                const values = watches.map((w) => row.format(w));
                const allSame = values.every((v) => v === values[0]);

                if (showDiffOnly && allSame) return null;

                return (
                  <tr key={i} className="hover:bg-ivory/40 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-graphite bg-ivory/20">
                      {row.label}
                    </td>
                    {watches.map((watch) => (
                      <td key={watch.id} className="p-4 sm:p-5 text-charcoal">
                        {row.format(watch)}
                      </td>
                    ))}
                    {watches.length < 4 && <td className="p-4 sm:p-5 bg-porcelain/10" />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
