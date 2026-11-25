import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Truck, CheckCircle2, Clock } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('Blue Dart Luxury Priority');
  const [newStatus, setNewStatus] = useState('PROCESSING');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/admin/orders');
      setOrders(data || []);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string) => {
    try {
      await apiRequest(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
          courierName: courierName || undefined,
          description: `Status updated to ${newStatus} by master atelier dispatch.`,
        }),
      });
      setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-platinum pb-4">
        <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Acquisition Fulfillment</span>
        <h1 className="font-serif-luxury text-3xl text-charcoal">Client Orders Ledger</h1>
      </div>

      {loading ? (
        <div className="text-xs text-silver">Loading Orders...</div>
      ) : (
        <div className="bg-pure border border-platinum rounded-sm overflow-x-auto shadow-subtle">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-ivory border-b border-platinum text-[10px] uppercase tracking-wider text-silver">
                <th className="p-4">Reference</th>
                <th className="p-4">Client</th>
                <th className="p-4">Timepieces</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-ivory/50">
                  <td className="p-4 font-mono font-medium text-charcoal">{o.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-medium text-charcoal">{o.customerName}</p>
                    <p className="text-[10px] text-silver">{o.customerEmail}</p>
                  </td>
                  <td className="p-4 text-silver">
                    {o.items?.map((i: any) => `${i.productTitle} (x${i.quantity})`).join(', ') || '1 Piece'}
                  </td>
                  <td className="p-4 font-serif-luxury text-sm font-medium">
                    ₹{o.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-sm text-[10px] uppercase font-medium bg-green-50 text-green-700 border border-green-200">
                      {o.paymentStatus} &bull; {o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-sm text-[10px] uppercase font-medium bg-ivory text-gold border border-gold/30">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setNewStatus(o.orderStatus);
                        setTrackingNumber(o.trackingNumber || '');
                        setCourierName(o.courierName || 'Blue Dart Luxury Priority');
                      }}
                      className="px-3 py-1 border border-charcoal text-[11px] uppercase tracking-wider hover:bg-charcoal hover:text-pure rounded-sm transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-pure p-8 max-w-md w-full border border-platinum rounded-sm space-y-6 shadow-2xl">
            <h2 className="font-serif-luxury text-2xl text-charcoal border-b border-platinum pb-2">
              Update Order #{selectedOrder.orderNumber}
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-silver block mb-1">Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none"
                >
                  <option value="ORDER_PLACED">ORDER_PLACED</option>
                  <option value="PROCESSING">PROCESSING (Chronometer Inspection)</option>
                  <option value="PACKED">PACKED (Walnut Vaulted)</option>
                  <option value="SHIPPED">SHIPPED (In Transit)</option>
                  <option value="DELIVERED">DELIVERED (Client Signature Received)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="text-silver block mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-2 bg-porcelain border border-platinum rounded-sm text-charcoal"
                />
              </div>

              <div>
                <label className="text-silver block mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  placeholder="e.g. BLUEDART-VK-994821"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2 bg-porcelain border border-platinum rounded-sm text-charcoal"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-platinum">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-platinum text-charcoal hover:bg-porcelain rounded-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id)}
                  className="px-6 py-2 bg-charcoal text-pure uppercase tracking-wider hover:bg-gold rounded-sm"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
