export type WatchMovementType = 'Automatic' | 'Mechanical' | 'Quartz' | 'Chronograph';
export type WatchGender = 'Men' | 'Women' | 'Unisex';
export type WatchCaseMaterial = '316L Stainless Steel' | '904L Oystersteel' | 'Titanium Grade 5' | 'Rose Gold PVD' | 'Ceramic' | 'Platinum Plated';
export type WatchCrystal = 'Sapphire Crystal (Anti-Reflective)' | 'Domed Sapphire Crystal' | 'Hardened Mineral Crystal';
export type WatchStrapMaterial = 'Full-Grain Italian Leather' | 'Alligator-Embossed Leather' | 'Solid Stainless Steel Link' | 'Milanese Mesh' | 'Silicone Sport' | 'Suede Calfskin';
export type WatchDialFinish = 'Sunburst Brushed' | 'Enamel Lacquer' | 'Matte Velveteen' | 'Open Heart Skeleton' | 'Guilloché' | 'Aventurine Textured';

export interface WatchSpecifications {
  // General
  brand: string;
  modelName: string;
  modelNumber: string;
  sku: string;
  collection: string;
  gender: WatchGender;
  watchType: string;
  countryOfOrigin: string;

  // Movement
  movementType: WatchMovementType;
  movementManufacturer: string;
  calibre: string;
  powerSource: string;
  powerReserve: string;
  accuracy: string;
  frequency: string;
  jewelCount: number;

  // Case
  caseMaterial: WatchCaseMaterial;
  caseDiameterMm: number;
  caseThicknessMm: number;
  caseShape: 'Round' | 'Square' | 'Tonneau' | 'Cushion';
  caseColour: string;
  caseFinish: string;
  bezelMaterial: string;
  caseBackType: 'Exhibition Sapphire' | 'Solid Engraved Screwed' | 'Snap-on';
  crownType: 'Push/Pull Fluted' | 'Screw-down with Embossed VK Logo';
  lugToLugMm: number;

  // Dial
  dialColour: string;
  dialFinish: WatchDialFinish;
  displayType: 'Analog 3-Hand' | 'Analog Chronograph' | 'Analog Small Seconds' | 'Dual Time';
  hourMarkers: string;
  handMaterial: string;
  luminousIndicators: string;
  dateDisplay: boolean;
  dayDisplay: boolean;
  subDials: number;

  // Crystal
  crystalMaterial: WatchCrystal;
  antiReflectiveCoating: boolean;

  // Strap
  strapMaterial: WatchStrapMaterial;
  strapColour: string;
  strapWidthMm: number;
  lugWidthMm: number;
  braceletConstruction: string;
  claspType: 'Deployant Butterfly Clasp' | 'Pin Buckle' | 'Folding Safety Clasp';
  interchangeableStrap: boolean;

  // Resistance
  waterResistanceAtm: number;
  waterResistanceMeters: number;
  shockResistance: boolean;
  magneticResistance: string;

  // Additional Features
  chronograph?: boolean;
  tachymeter?: boolean;
  gmt?: boolean;
  moonPhase?: boolean;
  skeletonDial?: boolean;
  exhibitionCaseBack?: boolean;

  // Commercial / Physical
  productWeightGrams: number;
  wristSizeRangeMm: [number, number];
  warrantyYears: number;
  packageContents: string[];
  careInstructions: string;
}

export interface WatchVariant {
  id: string;
  productId: string;
  sku: string;
  dialColour: string;
  strapColour: string;
  strapMaterial: WatchStrapMaterial;
  price: number;
  compareAtPrice?: number;
  stock: number;
  imageUrls: string[];
}

export interface WatchProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  collectionSlug: string;
  collectionName: string;
  category: string;
  gender: WatchGender;
  movementType: WatchMovementType;
  caseDiameterMm: number;
  price: number;
  compareAtPrice?: number;
  currency: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isLimitedEdition: boolean;
  editionLimit?: number;
  stock: number;
  primaryImage: string;
  secondaryImage: string;
  galleryImages: string[];
  specifications: WatchSpecifications;
  variants: WatchVariant[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WatchCollection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  thumbnailImage: string;
  productCount: number;
  accentQuote?: string;
  aestheticTone: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  product: WatchProduct;
  selectedDialColour?: string;
  selectedStrapColour?: string;
  selectedStrapMaterial?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  appliedCoupon?: Coupon;
  shippingFee: number;
  taxAmount: number;
  total: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Payment Pending'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Refunded';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash on Delivery';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productTitle: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  selectedDialColour?: string;
  selectedStrapMaterial?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  isGuest: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue?: number;
  validUntil: string;
  isActive: boolean;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readingTimeMinutes: number;
  publishedAt: string;
  category: 'Craftsmanship' | 'Horology' | 'Style Guide' | 'Maintenance' | 'Brand Story';
  coverImage: string;
  tags: string[];
}

export interface WatchReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'order_manager' | 'customer';
  phone?: string;
  savedAddresses: ShippingAddress[];
  wishlistProductIds: string[];
  createdAt: string;
}
