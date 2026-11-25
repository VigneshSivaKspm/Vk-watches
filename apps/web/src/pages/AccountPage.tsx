import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { apiRequest } from '../services/api';
import { User, Package, MapPin, Settings, LogOut, CheckCircle2 } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, logout, token } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      try {
        const data = await apiRequest('/auth/me');
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-silver">Accessing Client Vault...</div>;
  }

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Account Header */}
        <div className="bg-pure p-8 rounded-sm border border-platinum flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">VK TIME Client Portfolio</span>
            <h1 className="font-serif-luxury text-3xl text-charcoal">{profile?.name || user?.name}</h1>
            <p className="text-xs text-silver">{profile?.email || user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-platinum hover:border-red-400 text-xs flex items-center gap-1.5 text-graphite hover:text-red-500 transition-colors w-fit"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation & Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="md:col-span-3 bg-pure p-4 rounded-sm border border-platinum space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full p-3 text-left text-xs flex items-center gap-2.5 rounded-sm transition-colors ${
                activeTab === 'orders'
                  ? 'bg-charcoal text-pure font-medium'
                  : 'text-graphite hover:bg-porcelain'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Acquisition History</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full p-3 text-left text-xs flex items-center gap-2.5 rounded-sm transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-charcoal text-pure font-medium'
                  : 'text-graphite hover:bg-porcelain'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full p-3 text-left text-xs flex items-center gap-2.5 rounded-sm transition-colors ${
                activeTab === 'settings'
                  ? 'bg-charcoal text-pure font-medium'
                  : 'text-graphite hover:bg-porcelain'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Active Tab Main Panel */}
          <div className="md:col-span-9 bg-pure p-6 sm:p-8 rounded-sm border border-platinum shadow-subtle min-h-[400px]">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif-luxury text-2xl text-charcoal border-b border-platinum pb-3">
                  Acquisition History & Registered Warranties
                </h2>

                {(!profile?.orders || profile.orders.length === 0) ? (
                  <div className="text-center py-12 space-y-3">
                    <p className="font-serif-luxury text-xl text-silver">No Timepiece Acquisitions on Record</p>
                    <p className="text-xs text-graphite max-w-sm mx-auto">
                      Explore our collections to acquire your initial signature timepiece.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.orders.map((order: any) => (
                      <div key={order.id} className="p-4 border border-platinum rounded-sm space-y-3 bg-ivory/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-b border-platinum pb-2">
                          <div>
                            <span className="text-silver block text-[10px]">Reference</span>
                            <span className="font-mono font-medium text-charcoal">{order.orderNumber}</span>
                          </div>
                          <div className="mt-1 sm:mt-0 sm:text-right">
                            <span className="text-silver block text-[10px]">Total Investment</span>
                            <span className="font-serif-luxury text-sm text-charcoal font-medium">
                              ₹{order.totalAmount?.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="mt-1 sm:mt-0 sm:text-right">
                            <span className="text-silver block text-[10px]">Status</span>
                            <span className="text-gold uppercase tracking-wider font-medium text-[11px]">
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-silver">
                            Date: {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <Link
                            to={`/track-order?orderNumber=${order.orderNumber}`}
                            className="text-charcoal hover:text-gold underline text-[11px]"
                          >
                            Track Live Transit &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h2 className="font-serif-luxury text-2xl text-charcoal border-b border-platinum pb-3">
                  Saved Vault Delivery Destinations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile?.addresses?.map((addr: any) => (
                    <div key={addr.id} className="p-4 border border-platinum rounded-sm bg-ivory space-y-1 text-xs">
                      <p className="font-medium text-charcoal">{addr.fullName}</p>
                      <p className="text-graphite">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-graphite">{addr.addressLine2}</p>}
                      <p className="text-graphite">{addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p className="text-silver text-[11px]">{addr.country} &bull; {addr.phone}</p>
                      {addr.isDefault && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-charcoal text-pure text-[9px] uppercase tracking-wider">
                          Default Destination
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="font-serif-luxury text-2xl text-charcoal border-b border-platinum pb-3">
                  Account Credentials & Preferences
                </h2>
                <div className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="text-silver block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      disabled
                      value={profile?.name || ''}
                      className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="text-silver block mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={profile?.email || ''}
                      className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal"
                    />
                  </div>
                  <p className="text-[11px] text-silver pt-2">
                    To modify sensitive identification credentials or transfer registered warranty titles, please submit an inquiry to concierge@vktime.com.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
