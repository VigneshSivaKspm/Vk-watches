import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { SearchModal } from '../components/common/SearchModal';
import { BackgroundWatchAesthetics } from '../components/common/BackgroundWatchAesthetics';
import { PageStage, usePageTransition } from '../animations/transitions';
import { Preloader } from '../components/common/Preloader';

// Storefront Pages
import { HomePage } from '../pages/HomePage';

// Route-level code splitting: each page is fetched only when first visited
const ChatWidget = lazy(() => import('../components/chat/ChatWidget').then((m) => ({ default: m.ChatWidget })));
const ShopPage = lazy(() => import('../pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const CollectionsPage = lazy(() => import('../pages/CollectionsPage').then((m) => ({ default: m.CollectionsPage })));
const CollectionDetailPage = lazy(() => import('../pages/CollectionDetailPage').then((m) => ({ default: m.CollectionDetailPage })));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage').then((m) => ({ default: m.ProductDetailsPage })));
const ComparePage = lazy(() => import('../pages/ComparePage').then((m) => ({ default: m.ComparePage })));
const WatchFinderPage = lazy(() => import('../pages/WatchFinderPage').then((m) => ({ default: m.WatchFinderPage })));
const SizeGuidePage = lazy(() => import('../pages/SizeGuidePage').then((m) => ({ default: m.SizeGuidePage })));
const CraftsmanshipPage = lazy(() => import('../pages/CraftsmanshipPage').then((m) => ({ default: m.CraftsmanshipPage })));
const JournalPage = lazy(() => import('../pages/JournalPage').then((m) => ({ default: m.JournalPage })));
const JournalArticlePage = lazy(() => import('../pages/JournalArticlePage').then((m) => ({ default: m.JournalArticlePage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const WatchCarePage = lazy(() => import('../pages/WatchCarePage').then((m) => ({ default: m.WatchCarePage })));
const WarrantyPage = lazy(() => import('../pages/WatchCarePage').then((m) => ({ default: m.WarrantyPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('../pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const CartPage = lazy(() => import('../pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const TrackOrderPage = lazy(() => import('../pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const WishlistPage = lazy(() => import('../pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const LoginPage = lazy(() => import('../pages/AuthPages').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/AuthPages').then((m) => ({ default: m.RegisterPage })));
const AccountPage = lazy(() => import('../pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const MenPage = lazy(() => import('../pages/CategoryPages').then((m) => ({ default: m.MenPage })));
const WomenPage = lazy(() => import('../pages/CategoryPages').then((m) => ({ default: m.WomenPage })));
const UnisexPage = lazy(() => import('../pages/CategoryPages').then((m) => ({ default: m.UnisexPage })));
const NewArrivalsPage = lazy(() => import('../pages/CategoryPages').then((m) => ({ default: m.NewArrivalsPage })));
const BestsellersPage = lazy(() => import('../pages/CategoryPages').then((m) => ({ default: m.BestsellersPage })));
const LimitedEditionPage = lazy(() => import('../pages/CategoryPages').then((m) => ({ default: m.LimitedEditionPage })));
const SearchPage = lazy(() => import('../pages/CategoryPages').then((m) => ({ default: m.SearchPage })));
const ShippingPolicyPage = lazy(() => import('../pages/PolicyPages').then((m) => ({ default: m.ShippingPolicyPage })));
const ReturnPolicyPage = lazy(() => import('../pages/PolicyPages').then((m) => ({ default: m.ReturnPolicyPage })));
const PrivacyPolicyPage = lazy(() => import('../pages/PolicyPages').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('../pages/PolicyPages').then((m) => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const AdminLayout = lazy(() => import('../admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('../admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('../admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('../admin/AdminProducts').then((m) => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('../admin/AdminOrders').then((m) => ({ default: m.AdminOrders })));
const AdminCoupons = lazy(() => import('../admin/AdminCoupons').then((m) => ({ default: m.AdminCoupons })));
const AdminSettings = lazy(() => import('../admin/AdminCoupons').then((m) => ({ default: m.AdminSettings })));

// Warm the storefront chunks once the browser is idle so navigation never waits on the network
const prefetchStorefront = () => {
  Promise.all([
    import('../pages/AboutPage'),
    import('../pages/AccountPage'),
    import('../pages/AuthPages'),
    import('../pages/CartPage'),
    import('../pages/CategoryPages'),
    import('../pages/CheckoutPage'),
    import('../pages/CollectionDetailPage'),
    import('../pages/CollectionsPage'),
    import('../pages/ComparePage'),
    import('../pages/ContactPage'),
    import('../pages/CraftsmanshipPage'),
    import('../pages/FaqPage'),
    import('../pages/JournalArticlePage'),
    import('../pages/JournalPage'),
    import('../pages/NotFoundPage'),
    import('../pages/OrderSuccessPage'),
    import('../pages/PolicyPages'),
    import('../pages/ProductDetailsPage'),
    import('../pages/ShopPage'),
    import('../pages/SizeGuidePage'),
    import('../pages/TrackOrderPage'),
    import('../pages/WatchCarePage'),
    import('../pages/WatchFinderPage'),
    import('../pages/WishlistPage'),
  ]).catch(() => undefined);
};

export const AppRoutes: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(prefetchStorefront, { timeout: 4000 });
    else setTimeout(prefetchStorefront, 2500);
  }, []);
  const { displayLocation, overlay } = usePageTransition();
  const isAdmin = displayLocation.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-charcoal selection:text-pure bg-ivory">
      {/* Background Watch Aesthetics (Secondary ambient motion) */}
      {!isAdmin && <BackgroundWatchAesthetics />}

      {/* Global Storefront Header */}
      {!isAdmin && <Navbar onOpenSearch={() => setSearchOpen(true)} />}

      {/* Opening sequence + route curtain */}
      {!isAdmin && <Preloader />}
      {overlay}

      {/* Main Content with Unique Watch Route Transitions */}
      <div className="flex-1 flex flex-col relative z-10">
        <PageStage key={displayLocation.pathname} pathname={displayLocation.pathname}>
          <Suspense fallback={<div className="flex-1 min-h-[60vh]" />}>
          <Routes location={displayLocation}>
            {/* Customer Storefront Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:slug" element={<CollectionDetailPage />} />
            <Route path="/men" element={<MenPage />} />
            <Route path="/women" element={<WomenPage />} />
            <Route path="/unisex" element={<UnisexPage />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/bestsellers" element={<BestsellersPage />} />
            <Route path="/limited-edition" element={<LimitedEditionPage />} />
            <Route path="/watch/:slug" element={<ProductDetailsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/watch-finder" element={<WatchFinderPage />} />
            <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:slug" element={<JournalArticlePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/watch-care" element={<WatchCarePage />} />
            <Route path="/warranty" element={<WarrantyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />

            {/* Authentication & Customer Account */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<LoginPage />} />
            <Route path="/reset-password" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/orders" element={<AccountPage />} />
            <Route path="/account/orders/:orderId" element={<TrackOrderPage />} />
            <Route path="/account/addresses" element={<AccountPage />} />
            <Route path="/account/settings" element={<AccountPage />} />

            {/* Policies */}
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/return-policy" element={<ReturnPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Integrated Administration Panel */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProducts />} />
              <Route path="products/:id/edit" element={<AdminProducts />} />
              <Route path="categories" element={<AdminProducts />} />
              <Route path="collections" element={<AdminProducts />} />
              <Route path="inventory" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrders />} />
              <Route path="customers" element={<AdminDashboard />} />
              <Route path="payments" element={<AdminDashboard />} />
              <Route path="returns" element={<AdminOrders />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="reviews" element={<AdminProducts />} />
              <Route path="banners" element={<AdminDashboard />} />
              <Route path="media" element={<AdminDashboard />} />
              <Route path="journal" element={<AdminDashboard />} />
              <Route path="newsletter" element={<AdminDashboard />} />
              <Route path="reports" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminDashboard />} />
            </Route>

            {/* 404 Custom Not Found */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
        </PageStage>
      </div>

      {/* Global Storefront Footer */}
      {!isAdmin && <Footer />}

      {/* Interactive Cart Drawer */}
      {!isAdmin && <CartDrawer />}

      {/* AI Concierge Chat */}
      {!isAdmin && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}

      {/* Live Search Modal */}
      {!isAdmin && <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
    </div>
  );
};

export default AppRoutes;
