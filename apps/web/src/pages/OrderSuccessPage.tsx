import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, Truck, Package } from 'lucide-react';
import { apiRequest } from '../services/api';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      try {
        const data = await apiRequest(`/orders/${orderId}`);
        setOrder(data);
      } catch (e) {
        console.error('Error loading order confirmation:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-pure border border-platinum rounded-sm p-8 sm:p-12 shadow-luxe space-y-8 text-center animate-in zoom-in-95 duration-500">
        {/* Horological Time Completed Dial Rotation into Checkmark */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <svg className="w-full h-full animate-dial-spin-slow text-gold" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E8E8E8" strokeWidth="2" strokeDasharray="4 6" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#B49A73" strokeWidth="2" strokeDasharray="30 180" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-charcoal text-pure rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-700">
              <Check className="w-6 h-6 text-gold" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Acquisition Confirmed</span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-charcoal">
            Time, Entrusted to You
          </h1>
          <p className="text-xs sm:text-sm text-graphite font-light max-w-md mx-auto">
            Your timepiece order has been registered in the VK Horological Ledger. Master chronometer verification is underway.
          </p>
        </div>

        {/* Order Details Banner */}
        <div className="bg-ivory p-6 rounded-sm border border-platinum/80 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-platinum pb-3 text-xs">
            <div>
              <span className="text-silver block">Acquisition Reference</span>
              <span className="font-mono font-medium text-charcoal text-sm">{order?.orderNumber || orderId}</span>
            </div>
            <div className="mt-2 sm:mt-0 sm:text-right">
              <span className="text-silver block">Status</span>
              <span className="text-gold font-medium uppercase tracking-wider text-[11px]">
                {order?.orderStatus || 'Registered'}
              </span>
            </div>
          </div>

          {order && (
            <div className="space-y-2 text-xs text-graphite pt-1">
              <div className="flex justify-between">
                <span>Deliver To:</span>
                <span className="text-charcoal font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-charcoal font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount Authorized:</span>
                <span className="font-serif-luxury text-base text-charcoal font-medium">
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs text-graphite font-light border-y border-platinum py-6">
          <div className="flex gap-3">
            <Package className="w-5 h-5 text-gold flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Inspection & Vaulting</p>
              <p className="text-silver text-[11px] mt-0.5">Tested for water integrity and packaged in solid walnut presentation box.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Truck className="w-5 h-5 text-gold flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Insured Air Transit</p>
              <p className="text-silver text-[11px] mt-0.5">Dispatched via secure armoured luxury courier with tracking credentials.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />
            <div>
              <p className="font-medium text-charcoal">Warranty Active</p>
              <p className="text-silver text-[11px] mt-0.5">5-Year international mechanical protection registered automatically.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            to={`/track-order?orderNumber=${order?.orderNumber || orderId}`}
            className="px-8 py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors"
          >
            Track Order Progress
          </Link>

          <Link
            to="/shop"
            className="px-8 py-3.5 bg-pure border border-platinum hover:border-charcoal text-charcoal text-xs uppercase tracking-luxury transition-colors"
          >
            Continue Exploring
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
