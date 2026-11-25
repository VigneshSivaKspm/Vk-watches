import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle2, Clock, Truck, Package, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../services/api';
import { PageHero } from '../components/common/PageHero';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderQuery, setOrderQuery] = useState(searchParams.get('orderNumber') || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest(`/orders/${encodeURIComponent(id.trim())}`);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Order reference not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get('orderNumber');
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderQuery);
  };

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <PageHero
          compact
          eyebrow="Concierge Tracking Portal"
          title="Track Timepiece Transit"
          description="Enter your VK TIME order number to follow inspection, certification and insured courier dispatch."
          image="/images/scenes/banner-travel.svg"
        />

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="bg-pure p-4 rounded-sm border border-platinum shadow-subtle flex gap-2">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Enter Order Number (e.g. VKT-2026-90412)"
            required
            className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-charcoal focus:outline-none placeholder:text-silver"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Locating...' : 'Track'}</span>
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-sm text-xs text-center">
            {error}. Please verify your reference number or contact concierge@vktime.com.
          </div>
        )}

        {/* Tracking Result View */}
        {order && (
          <div className="bg-pure border border-platinum rounded-sm p-8 shadow-luxe space-y-8 animate-in fade-in duration-300">
            {/* Order Summary Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-platinum pb-4 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-silver">Order Identifier</span>
                <p className="font-mono text-base font-medium text-charcoal">{order.orderNumber}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-silver">Destination</span>
                <p className="text-xs text-charcoal">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase tracking-luxury text-silver">Status</span>
                <p className="text-xs uppercase tracking-wider text-gold font-medium">{order.orderStatus}</p>
              </div>
            </div>

            {/* Courier Details */}
            {order.trackingNumber && (
              <div className="bg-ivory p-4 rounded-sm border border-platinum flex justify-between items-center text-xs">
                <div>
                  <span className="text-silver block text-[10px] uppercase">Courier Partner</span>
                  <span className="font-medium text-charcoal">{order.courierName || 'Blue Dart Luxury Priority'}</span>
                </div>
                <div className="text-right">
                  <span className="text-silver block text-[10px] uppercase">Air Waybill Reference</span>
                  <span className="font-mono font-medium text-charcoal">{order.trackingNumber}</span>
                </div>
              </div>
            )}

            {/* Visual Horological Timeline */}
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-xl text-charcoal">Horological Transit Milestones</h3>
              <div className="relative pl-6 border-l-2 border-platinum space-y-8">
                {order.timeline?.map((step: any, index: number) => (
                  <div key={index} className="relative group">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-gold border-2 border-pure shadow-sm flex items-center justify-center" />
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-wider font-medium text-charcoal">
                          {step.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-silver font-mono">
                          {new Date(step.timestamp).toLocaleDateString()} &bull; {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-graphite/80 font-light mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Items Preview */}
            <div className="border-t border-platinum pt-6 space-y-4">
              <h4 className="text-xs uppercase tracking-luxury text-silver font-medium">Acquired Timepieces</h4>
              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-ivory/50 rounded-sm">
                    <img src={item.image} alt={item.productTitle} className="w-12 h-12 object-contain bg-white rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-charcoal truncate">{item.productTitle}</p>
                      <p className="text-[10px] text-silver">{item.selectedDial} &bull; Qty: {item.quantity}</p>
                    </div>
                    <span className="font-serif-luxury text-sm text-charcoal font-medium">
                      ₹{item.subtotal?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
