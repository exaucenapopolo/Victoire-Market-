import type { FCFA } from "../money.js";
import type { OrderStatus } from "./order-status.js";
import type { PricingRules } from "./pricing.js";

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  displayName: string;
}

export interface Store {
  id: string;
  sellerProfileId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  /** Zone générale affichée publiquement (ex. "Bertoua - Mokolo"). */
  generalArea?: string;
  hasPhysicalLocation: boolean;
  verified: boolean;
  verifiedUntil?: string;
}

export interface StoreVerification {
  id: string;
  storeId: string;
  fee: FCFA;
  durationMonths: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  decisionReason?: string;
  decidedBy?: string;
  decidedAt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId?: string;
  name: string;
  slug: string;
  description?: string;
  /** Prix net vendeur. La commission est ajoutée par le moteur. */
  sellerNetPrice: FCFA;
  active: boolean;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  position: number;
}

export interface Inventory {
  productId: string;
  available: number;
  reserved: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  storeId: string;
  productNameSnapshot: string;
  quantity: number;
  sellerNetPriceSnapshot: FCFA;
  commissionSnapshot: FCFA;
}

export type FulfillmentMethod = "PICKUP" | "DELIVERY";

export interface Order {
  id: string;
  reference: string;
  customerId?: string;
  status: OrderStatus;
  fulfillment: FulfillmentMethod;
  currency: "XAF";
  pricing: PricingRules;
  sellerSubtotal: FCFA;
  victoireCommission: FCFA;
  deliveryFee: FCFA;
  paymentFee: FCFA;
  customerTotal: FCFA;
  sellerPayout: FCFA;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  providerRef: string;
  amount: FCFA;
  status: PaymentStatus;
  createdAt: string;
}

export interface SellerPayout {
  id: string;
  orderId: string;
  storeId: string;
  amount: FCFA;
  status: "PENDING" | "ELIGIBLE" | "PAID" | "CANCELLED";
  eligibleAt?: string;
  paidAt?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: FCFA;
  active: boolean;
}

export interface Delivery {
  id: string;
  orderId: string;
  zoneId: string;
  fee: FCFA;
  agentId?: string;
  status:
    | "PREPARING"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "FAILED"
    | "RETURNED";
  proofUrl?: string;
}

export interface SearchRequest {
  id: string;
  customerId?: string;
  contactPhone?: string;
  productWanted: string;
  quantity: number;
  maxBudget?: FCFA;
  photoUrl?: string;
  notes?: string;
  desiredDelay?: string;
  status: "OPEN" | "SOURCING" | "OFFERED" | "CLOSED";
  createdAt: string;
}

export interface SourcingOffer {
  id: string;
  searchRequestId: string;
  price: FCFA;
  available: boolean;
  delay?: string;
  conditions?: string;
  createdAt: string;
}
