import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { apiRequest } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, appliedCoupon, getSubtotal, getDiscount, getTax, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    addressLine1: 'Penthouse 14B, The Grand Residences',
    addressLine2: 'Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400018',
    country: 'India',
    paymentMethod: 'UPI' as 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash on Delivery',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="font-serif-luxury text-3xl text-charcoal">Your Bag is Empty</h2>
        <p className="text-xs text-graphite">Please select a timepiece before accessing the secure checkout terminal.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedDialColour: i.selectedDialColour,
          selectedStrapMaterial: i.selectedStrapMaterial,
        })),
        couponCode: appliedCoupon?.code,
        paymentMethod: formData.paymentMethod,
      };

      const res = await apiRequest<{ orderNumber: string; orderId: string }>('/checkout/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      clearCart();
      navigate(`/order-success/${res.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place timepiece acquisition order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-platinum pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Encrypted Checkout</span>
            <h1 className="font-serif-luxury text-3xl text-charcoal">Acquisition Finalization</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-silver">
            <Lock className="w-4 h-4 text-gold" />
            <span>256-Bit SSL Secured</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-sm text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Details, Shipping, Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Information */}
            <div className="bg-pure p-6 rounded-sm border border-platinum space-y-4">
              <h2 className="font-serif-luxury text-xl text-charcoal border-b border-platinum pb-2">
                1. Wearer & Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-silver block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm focus:outline-none focus:border-charcoal text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm focus:outline-none focus:border-charcoal text-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-silver block mb-1">Telephone (For Luxury Courier Transit)</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm focus:outline-none focus:border-charcoal text-charcoal"
                  />
                </div>
              </div>
            </div>

            {/* 2. Insured Shipping Address */}
            <div className="bg-pure p-6 rounded-sm border border-platinum space-y-4">
              <h2 className="font-serif-luxury text-xl text-charcoal border-b border-platinum pb-2">
                2. Insured Destination Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-silver block mb-1">Street Address</label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm focus:outline-none focus:border-charcoal text-charcoal"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-silver block mb-1">Apartment / Suite / Landmark (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm focus:outline-none focus:border-charcoal text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm focus:outline-none focus:border-charcoal text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm focus:outline-none focus:border-charcoal text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">PIN / Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm focus:outline-none focus:border-charcoal text-charcoal"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    disabled
                    value={formData.country}
                    className="w-full p-2.5 bg-platinum/40 border border-platinum rounded-sm text-silver"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-pure p-6 rounded-sm border border-platinum space-y-4">
              <h2 className="font-serif-luxury text-xl text-charcoal border-b border-platinum pb-2">
                3. Payment Architecture
              </h2>
              <div className="space-y-3 text-xs">
                {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'].map((m) => (
                  <label
                    key={m}
                    className={`flex items-center justify-between p-3.5 border rounded-sm cursor-pointer transition-colors ${
                      formData.paymentMethod === m
                        ? 'border-charcoal bg-ivory font-medium'
                        : 'border-platinum bg-pure hover:bg-porcelain'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m}
                        checked={formData.paymentMethod === m}
                        onChange={handleChange}
                        className="accent-charcoal"
                      />
                      <span>{m}</span>
                    </div>
                    {m === 'UPI' && <span className="text-[10px] text-gold uppercase tracking-wider">Instant Razorpay Gateway</span>}
                    {m === 'Cash on Delivery' && <span className="text-[10px] text-silver uppercase tracking-wider">Pay Upon Arrival</span>}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-pure p-6 rounded-sm border border-platinum space-y-4 shadow-subtle">
              <h3 className="font-serif-luxury text-xl text-charcoal border-b border-platinum pb-2">
                Acquisition Review
              </h3>

              {/* Items summary */}
              <div className="space-y-3 divide-y divide-platinum/60">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img loading="lazy" decoding="async"
                      src={item.product.primaryImage}
                      alt={item.product.title}
                      className="w-14 h-14 object-contain bg-porcelain rounded-sm p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-charcoal truncate">{item.product.title}</p>
                      <p className="text-[11px] text-silver">Qty: {item.quantity} &bull; {item.selectedDialColour}</p>
                      <p className="text-xs font-serif-luxury text-charcoal">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Authoritative Financial Breakdown */}
              <div className="space-y-2 text-xs text-graphite pt-3 border-t border-platinum">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toLocaleString('en-IN')}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Privilege Applied ({appliedCoupon?.code})</span>
                    <span>-₹{getDiscount().toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST Authority (18%)</span>
                  <span>₹{getTax().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-gold font-medium uppercase text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between text-lg font-serif-luxury text-charcoal pt-3 border-t border-platinum">
                  <span>Final Investment</span>
                  <span>₹{getTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-charcoal text-pure text-xs uppercase tracking-luxury font-medium hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>{loading ? 'Authorizing Acquisition...' : 'Confirm & Place Order'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-1 text-center text-[10px] text-silver pt-2">
                <p>By confirming your order, you agree to the VK TIME Terms of Sale & Warranty Governance.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
