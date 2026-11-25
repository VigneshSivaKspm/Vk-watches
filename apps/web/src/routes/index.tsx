import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { SearchModal } from '../components/common/SearchModal';
import { BackgroundWatchAesthetics } from '../components/common/BackgroundWatchAesthetics';
import { PageStage, usePageTransition } from '../animations/transitions';
import { Preloader } from '../components/common/Preloader';
import { ChatWidget } from '../components/chat/ChatWidget';

// Storefront Pages
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { CollectionsPage } from '../pages/CollectionsPage';
import { CollectionDetailPage } from '../pages/CollectionDetailPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ComparePage } from '../pages/ComparePage';
import { WatchFinderPage } from '../pages/WatchFinderPage';
import { SizeGuidePage } from '../pages/SizeGuidePage';
import { CraftsmanshipPage } from '../pages/CraftsmanshipPage';
import { JournalPage } from '../pages/JournalPage';
import { JournalArticlePage } from '../pages/JournalArticlePage';
import { AboutPage } from '../pages/AboutPage';
import { WatchCarePage, WarrantyPage } from '../pages/WatchCarePage';
import { ContactPage } from '../pages/ContactPage';
import { FaqPage } from '../pages/FaqPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderSuccessPage } from '../pages/OrderSuccessPage';
import { TrackOrderPage } from '../pages/TrackOrderPage';
import { WishlistPage } from '../pages/WishlistPage';
import { LoginPage, RegisterPage } from '../pages/AuthPages';
import { AccountPage } from '../pages/AccountPage';
import {
  MenPage,
  WomenPage,
  UnisexPage,
  NewArrivalsPage,
  BestsellersPage,
  LimitedEditionPage,
  SearchPage,
} from '../pages/CategoryPages';
import {
  ShippingPolicyPage,
  ReturnPolicyPage,
  PrivacyPolicyPage,
  TermsPage,
} from '../pages/PolicyPages';
import { NotFoundPage } from '../pages/NotFoundPage';

// Admin Panel
import { AdminLayout } from '../admin/AdminLayout';
import { AdminLogin } from '../admin/AdminLogin';
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminProducts } from '../admin/AdminProducts';
import { AdminOrders } from '../admin/AdminOrders';
import { AdminCoupons, AdminSettings } from '../admin/AdminCoupons';

export const AppRoutes: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
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
        </PageStage>
      </div>

      {/* Global Storefront Footer */}
      {!isAdmin && <Footer />}

      {/* Interactive Cart Drawer */}
      {!isAdmin && <CartDrawer />}

      {/* AI Concierge Chat */}
      {!isAdmin && <ChatWidget />}

      {/* Live Search Modal */}
      {!isAdmin && <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
    </div>
  );
};

export default AppRoutes;
