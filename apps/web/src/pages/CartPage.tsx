import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

export const CartPage: React.FC = () => {
  const {
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
    clearCart,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'WELCOMEVK') {
      applyCoupon({
        code: 'WELCOMEVK',
        description: '10% Welcome privilege on your timepiece',
        discountPercent: 10,
        validUntil: '2028-12-31',
        isActive: true,
      });
      setCouponCode('');
    } else if (code === 'HOROLOGY5000') {
      applyCoupon({
        code: 'HOROLOGY5000',
        description: 'Flat ₹5,000 privilege on luxury timepieces',
        discountAmount: 5000,
        minOrderValue: 40000,
        validUntil: '2028-12-31',
        isActive: true,
      });
      setCouponCode('');
    } else {
      setCouponMsg('Invalid promotional privilege code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif-luxury text-3xl text-charcoal">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-graphite max-w-md">
          You currently have no timepieces reserved in your bag. Browse our collections to select an iconic watch.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-platinum pb-4 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Acquisition Bag</span>
            <h1 className="font-serif-luxury text-3xl text-charcoal">Your Selected Timepieces</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-silver hover:text-red-500 transition-colors"
          >
            Clear Entire Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-pure p-6 rounded-sm border border-platinum divide-y divide-platinum">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={item.product.primaryImage}
                  alt={item.product.title}
                  className="w-24 h-24 object-contain bg-porcelain rounded-sm p-2 flex-shrink-0"
                />

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <Link
                    to={`/watch/${item.product.slug}`}
                    className="font-serif-luxury text-xl text-charcoal hover:text-gold block"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-xs text-silver">
                    Dial: {item.selectedDialColour} &bull; Strap: {item.selectedStrapMaterial}
                  </p>
                  <p className="text-xs text-silver font-mono">Ref: {item.product.slug}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-platinum rounded-sm text-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-charcoal hover:bg-porcelain"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-charcoal hover:bg-porcelain"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-serif-luxury text-lg text-charcoal min-w-[80px] text-right">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-silver hover:text-red-500 p-1 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-pure p-6 rounded-sm border border-platinum space-y-4 shadow-subtle">
              <h3 className="font-serif-luxury text-xl text-charcoal border-b border-platinum pb-3">
                Order Summary
              </h3>

              {/* Coupon form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-gold/10 px-3 py-2 rounded-sm text-xs text-charcoal border border-gold/30">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span>Privilege: <strong>{appliedCoupon.code}</strong></span>
                  </div>
                  <button onClick={removeCoupon} className="text-silver hover:text-charcoal underline text-[11px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Privilege Code (e.g. WELCOMEVK)"
                    className="flex-1 bg-porcelain border border-platinum px-3 py-1.5 text-xs text-charcoal focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-pure border border-charcoal text-xs uppercase hover:bg-charcoal hover:text-pure transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && <p className="text-[11px] text-red-500">{couponMsg}</p>}

              {/* Cost breakdown */}
              <div className="space-y-2 text-xs text-graphite pt-2">
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
                  <span>Authoritative GST (18%)</span>
                  <span>₹{getTax().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span className="text-gold font-medium uppercase text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between text-lg font-serif-luxury text-charcoal pt-3 border-t border-platinum">
                  <span>Total Amount</span>
                  <span>₹{getTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury font-medium hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-silver uppercase tracking-wider pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Complimentary Armoured Delivery &bull; 5-Yr Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
