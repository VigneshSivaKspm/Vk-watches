import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiRequest('/admin/dashboard');
        setStats(data);
      } catch (e) {
        console.error('Error fetching admin stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-xs text-silver">Loading operational metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Operational Overview</span>
        <h1 className="font-serif-luxury text-3xl text-charcoal">Atelier Dashboard</h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-pure p-6 rounded-sm border border-platinum space-y-2 shadow-subtle">
          <div className="flex justify-between items-center text-silver text-xs">
            <span>Verified Revenue</span>
            <DollarSign className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif-luxury text-2xl text-charcoal">
            ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
          </p>
          <span className="text-[10px] text-gold uppercase tracking-wider">Paid Acquisitions</span>
        </div>

        <div className="bg-pure p-6 rounded-sm border border-platinum space-y-2 shadow-subtle">
          <div className="flex justify-between items-center text-silver text-xs">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif-luxury text-2xl text-charcoal">{stats?.totalOrders || 0}</p>
          <span className="text-[10px] text-silver uppercase tracking-wider">Recorded Acquisitions</span>
        </div>

        <div className="bg-pure p-6 rounded-sm border border-platinum space-y-2 shadow-subtle">
          <div className="flex justify-between items-center text-silver text-xs">
            <span>Active Clients</span>
            <Users className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif-luxury text-2xl text-charcoal">{stats?.totalCustomers || 0}</p>
          <span className="text-[10px] text-silver uppercase tracking-wider">Registered Portfolios</span>
        </div>

        <div className="bg-pure p-6 rounded-sm border border-platinum space-y-2 shadow-subtle">
          <div className="flex justify-between items-center text-silver text-xs">
            <span>Low Stock Models</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-serif-luxury text-2xl text-charcoal">{stats?.lowStockCount || 0}</p>
          <span className="text-[10px] text-red-500 uppercase tracking-wider">&le; 5 Pieces Left</span>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-pure p-6 rounded-sm border border-platinum shadow-subtle space-y-4">
        <div className="flex justify-between items-center border-b border-platinum pb-3">
          <h2 className="font-serif-luxury text-xl text-charcoal">Recent Acquisition Transactions</h2>
          <Link to="/admin/orders" className="text-xs text-gold hover:text-charcoal underline">
            View All Orders &rarr;
          </Link>
        </div>

        {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
          <p className="text-xs text-silver py-6">No recent transactions recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-platinum text-silver text-[10px] uppercase tracking-wider">
                  <th className="py-2.5">Reference</th>
                  <th className="py-2.5">Client</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum/60">
                {stats.recentOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-ivory/50">
                    <td className="py-3 font-mono font-medium text-charcoal">{o.orderNumber}</td>
                    <td className="py-3">{o.customerName}</td>
                    <td className="py-3 font-serif-luxury text-sm">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-ivory border border-platinum text-[10px] uppercase text-gold font-medium rounded-sm">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-silver">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
