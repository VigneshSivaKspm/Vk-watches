import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Plus, Tag } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountPercent: 10,
    minOrderValue: 20000,
    validUntil: '2028-12-31',
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/admin/coupons');
      setCoupons(data || []);
    } catch (e) {
      console.error('Failed to load coupons', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(newCoupon),
      });
      setShowModal(false);
      loadCoupons();
    } catch (e: any) {
      alert(e.message || 'Failed to create coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-platinum pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Promotional Privileges</span>
          <h1 className="font-serif-luxury text-3xl text-charcoal">Coupon Privileges</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Privilege Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="bg-pure p-6 rounded-sm border border-platinum space-y-3 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-charcoal px-2.5 py-1 bg-ivory border border-platinum rounded-sm">
                {c.code}
              </span>
              <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-sm">Active</span>
            </div>
            <p className="text-xs text-graphite">{c.description}</p>
            <div className="text-[11px] text-silver pt-2 border-t border-platinum space-y-1">
              <p>Benefit: {c.discountPercent ? `${c.discountPercent}% Off` : `₹${c.discountAmount} Flat`}</p>
              <p>Min Order: ₹{c.minOrderValue?.toLocaleString('en-IN') || 0}</p>
              <p>Valid Until: {new Date(c.validUntil).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-pure p-8 max-w-md w-full border border-platinum rounded-sm space-y-6 shadow-2xl">
            <h2 className="font-serif-luxury text-2xl text-charcoal border-b border-platinum pb-2">
              Create Privilege Coupon
            </h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-silver block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIPTIMEPIECE"
                  className="w-full p-2 bg-porcelain border border-platinum rounded-sm"
                />
              </div>
              <div>
                <label className="text-silver block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full p-2 bg-porcelain border border-platinum rounded-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-silver block mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={newCoupon.discountPercent}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: parseFloat(e.target.value) })}
                    className="w-full p-2 bg-porcelain border border-platinum rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">Min Order (INR)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: parseFloat(e.target.value) })}
                    className="w-full p-2 bg-porcelain border border-platinum rounded-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-platinum">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-platinum rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-charcoal text-pure uppercase tracking-wider hover:bg-gold rounded-sm"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-platinum pb-4">
        <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">System Configuration</span>
        <h1 className="font-serif-luxury text-3xl text-charcoal">Storefront Governance Settings</h1>
      </div>

      <div className="bg-pure p-6 rounded-sm border border-platinum space-y-4 text-xs">
        <div>
          <label className="text-silver block mb-1">Brand Name</label>
          <input type="text" disabled value="VK TIME" className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm" />
        </div>
        <div>
          <label className="text-silver block mb-1">Authoritative Currency</label>
          <input type="text" disabled value="INR (₹) — Indian National Rupee" className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm" />
        </div>
        <div>
          <label className="text-silver block mb-1">GST Tax Rate Authority</label>
          <input type="text" disabled value="18% (Authoritative Central/State GST Standard)" className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm" />
        </div>
        <div>
          <label className="text-silver block mb-1">Default International Warranty Period</label>
          <input type="text" disabled value="5 Years (Calibre Mechanical Integrity Guarantee)" className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm" />
        </div>
      </div>
    </div>
  );
};
