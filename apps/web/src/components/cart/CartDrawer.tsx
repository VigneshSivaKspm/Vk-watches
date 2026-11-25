import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/useCartStore';

export const CartDrawer: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    items,
    removeItem,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getTax,
    getTotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();

    if (code === 'WELCOMEVK') {
      applyCoupon({
        code: 'WELCOMEVK',
        description: '10% Welcome privilege on your timepiece',
        discountPercent: 10,
        validUntil: '2028-12-31',
        isActive: true,
      });
      setCouponInput('');
    } else if (code === 'HOROLOGY5000') {
      applyCoupon({
        code: 'HOROLOGY5000',
        description: 'Flat ₹5,000 privilege on luxury timepieces',
        discountAmount: 5000,
        minOrderValue: 40000,
        validUntil: '2028-12-31',
        isActive: true,
      });
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired privilege coupon code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-pure shadow-2xl flex flex-col justify-between border-l border-platinum animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-platinum flex items-center justify-between bg-ivory">
            <div>
              <h2 className="font-serif-luxury text-xl text-charcoal">Your Shopping Bag</h2>
              <p className="text-xs text-silver mt-0.5">
                {items.length === 0 ? 'Empty bag' : `${items.length} unique timepiece(s)`}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-charcoal hover:text-gold transition-colors focus:outline-none"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-platinum">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <p className="font-serif-luxury text-xl text-silver">Your bag is presently empty.</p>
                <p className="text-xs text-graphite max-w-xs mx-auto">
                  Explore our curated collections of automatic, mechanical, and chronograph timepieces.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsOpen(false)}
                  className="inline-block px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors duration-300"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.product.primaryImage}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover bg-porcelain rounded-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/watch/${item.product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-charcoal hover:text-gold truncate block"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-silver mt-0.5">
                      {item.selectedDialColour} &bull; {item.selectedStrapMaterial}
                    </p>
                    <p className="text-xs font-serif-luxury text-charcoal mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-platinum rounded-sm text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-charcoal hover:bg-porcelain transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-charcoal hover:bg-porcelain transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-silver hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-platinum bg-ivory space-y-4">
              {/* Promo code */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-gold/10 px-3 py-2 rounded-sm text-xs text-charcoal border border-gold/30">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span>
                      Privilege: <strong>{appliedCoupon.code}</strong>
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-silver hover:text-charcoal underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Privilege Code (e.g. WELCOMEVK)"
                    className="flex-1 bg-pure border border-platinum px-3 py-1.5 text-xs text-charcoal focus:outline-none focus:border-charcoal"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-pure border border-charcoal text-xs uppercase tracking-wider hover:bg-charcoal hover:text-pure transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-graphite pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toLocaleString('en-IN')}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Privilege Discount</span>
                    <span>-₹{getDiscount().toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span>₹{getTax().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-gold font-medium uppercase text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-serif-luxury text-charcoal pt-2 border-t border-platinum">
                  <span>Total Amount</span>
                  <span>₹{getTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Direct Checkout CTA */}
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury font-medium flex items-center justify-center gap-2 hover:bg-gold transition-colors duration-300 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-silver uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>256-Bit Encrypted Secure Horological Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
