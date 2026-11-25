import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { VkLogo } from '../components/common/VkLogo';
import { useAuthStore } from '../stores/useAuthStore';
import {
  LayoutDashboard,
  Watch,
  ShoppingBag,
  Ticket,
  Users,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, token } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Product Catalog', path: '/admin/products', icon: Watch },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Privilege Coupons', path: '/admin/coupons', icon: Ticket },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-full min-h-screen bg-ivory flex flex-col lg:flex-row text-charcoal">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-pure border-r border-platinum flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="space-y-2">
            <VkLogo size="sm" />
            <span className="text-[9px] uppercase tracking-ultra text-gold font-medium block">
              Administration Deck
            </span>
          </div>

          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors ${
                    isActive
                      ? 'bg-charcoal text-pure font-medium'
                      : 'text-graphite hover:bg-porcelain'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-platinum space-y-3 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-silver hover:text-charcoal py-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-silver hover:text-red-500 py-1 w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
