import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getComparison,
  watchFinderRecommend,
  getCollections,
  getCollectionBySlug,
} from '../controllers/product.controller';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  addAddress,
} from '../controllers/auth.controller';
import {
  createOrder,
  getOrderByIdOrNumber,
  verifyPaymentSignature,
} from '../controllers/order.controller';
import {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminCoupons,
  createCoupon,
} from '../controllers/admin.controller';
import {
  getJournalArticles,
  getJournalArticleBySlug,
  subscribeNewsletter,
  submitContact,
} from '../controllers/content.controller';
import { chat } from '../controllers/chat.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Products & Catalog
router.get('/products', getProducts);
router.get('/products/compare', getComparison);
router.post('/products/finder', watchFinderRecommend);
router.get('/products/:slug', getProductBySlug);

// Collections
router.get('/collections', getCollections);
router.get('/collections/:slug', getCollectionBySlug);

// Auth & Customer Account
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/account/addresses', authenticateToken, addAddress);

// Checkout & Orders
router.post('/checkout/orders', createOrder);
router.post('/checkout/verify-payment', verifyPaymentSignature);
router.get('/orders/:identifier', getOrderByIdOrNumber);

// Content & Journal & Contact
router.get('/journal', getJournalArticles);
router.get('/journal/:slug', getJournalArticleBySlug);
router.post('/newsletter/subscribe', subscribeNewsletter);
router.post('/contact', submitContact);

// AI Concierge
router.post('/chat', chat);

// Admin Operations
router.get('/admin/dashboard', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), getDashboardStats);
router.get('/admin/products', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), getAdminProducts);
router.post('/admin/products', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), createProduct);
router.put('/admin/products/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), updateProduct);
router.delete('/admin/products/:id', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteProduct);
router.get('/admin/orders', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), getAdminOrders);
router.patch('/admin/orders/:id/status', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), updateOrderStatus);
router.get('/admin/coupons', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), getAdminCoupons);
router.post('/admin/coupons', authenticateToken, requireRole(['SUPER_ADMIN', 'ADMIN']), createCoupon);

export default router;
