/* ============================================================
 * Victoire Market — Domaine partagé (inliné pour apps/web)
 * ============================================================ */

/* ---------------------------- Monnaie ---------------------------- */

export type FCFA = number;

export function assertMoney(amount: number, label = "montant"): asserts amount is FCFA {
  if (!Number.isFinite(amount)) throw new Error(`${label} non fini: ${amount}`);
  if (!Number.isInteger(amount)) throw new Error(`${label} doit être un entier de FCFA: ${amount}`);
  if (amount < 0) throw new Error(`${label} négatif interdit: ${amount}`);
}

export function toFCFA(amount: number): FCFA {
  if (!Number.isFinite(amount)) throw new Error(`Montant non fini: ${amount}`);
  return Math.round(amount);
}

export function formatFCFA(amount: FCFA): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

/* ----------------------- Statuts de commande --------------------- */

export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "ACCEPTED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "PICKED_UP",
  "COMPLETED",
  "CANCELLED",
  "REFUND_PENDING",
  "REFUNDED",
  "DISPUTED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  PENDING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["ACCEPTED", "REFUND_PENDING", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "CANCELLED"],
  READY_FOR_PICKUP: ["PICKED_UP", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "DISPUTED"],
  DELIVERED: ["COMPLETED", "DISPUTED"],
  PICKED_UP: ["COMPLETED", "DISPUTED"],
  COMPLETED: ["REFUND_PENDING", "DISPUTED"],
  CANCELLED: [],
  REFUND_PENDING: ["REFUNDED", "DISPUTED"],
  REFUNDED: [],
  DISPUTED: ["REFUND_PENDING", "COMPLETED"],
} as const;

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from].includes(to);
}

export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Transition de commande interdite: ${from} → ${to}`);
  }
}

export const TERMINAL_STATUSES: readonly OrderStatus[] = ["CANCELLED", "REFUNDED"];

export function isTerminal(status: OrderStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

/* --------------------------- Tarification ------------------------ */

export interface PricingRules {
  commissionRate: number;
  paymentFeeRate: number;
  deliveryFee: FCFA;
}

export interface PricingLineInput {
  sellerNetPrice: FCFA;
  quantity: number;
}

export interface PricingInput {
  lines: readonly PricingLineInput[];
  rules: PricingRules;
  deliveryFeeOverride?: FCFA | null;
  discount?: FCFA;
}

export interface PricingBreakdown {
  sellerSubtotal: FCFA;
  victoireCommission: FCFA;
  productSubtotal: FCFA;
  deliveryFee: FCFA;
  discount: FCFA;
  amountBeforePaymentFee: FCFA;
  paymentFee: FCFA;
  customerTotal: FCFA;
  sellerPayout: FCFA;
  appliedRules: PricingRules;
}

export function grossUp(
  amountBefore: FCFA,
  feeRate: number,
): { total: FCFA; fee: FCFA } {
  if (!Number.isFinite(feeRate) || feeRate < 0 || feeRate >= 1) {
    throw new Error(`paymentFeeRate invalide: ${feeRate}`);
  }
  const total = Math.ceil(amountBefore / (1 - feeRate));
  return { total, fee: total - amountBefore };
}

export function computePricing(input: PricingInput): PricingBreakdown {
  const { lines, rules } = input;

  if (lines.length === 0) throw new Error("Au moins une ligne est requise.");
  if (rules.commissionRate < 0 || rules.commissionRate >= 1) {
    throw new Error(`commissionRate invalide: ${rules.commissionRate}`);
  }
  if (rules.paymentFeeRate < 0 || rules.paymentFeeRate >= 1) {
    throw new Error(`paymentFeeRate invalide: ${rules.paymentFeeRate}`);
  }
  if (rules.deliveryFee < 0) throw new Error("deliveryFee négatif interdit.");

  let sellerSubtotal = 0;
  for (const line of lines) {
    if (!Number.isInteger(line.sellerNetPrice) || line.sellerNetPrice < 0) {
      throw new Error(`sellerNetPrice invalide: ${line.sellerNetPrice}`);
    }
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
      throw new Error(`quantity invalide: ${line.quantity}`);
    }
    sellerSubtotal += line.sellerNetPrice * line.quantity;
  }
  sellerSubtotal = toFCFA(sellerSubtotal);

  const victoireCommission = toFCFA(sellerSubtotal * rules.commissionRate);
  const productSubtotal = sellerSubtotal + victoireCommission;

  const deliveryFee =
    input.deliveryFeeOverride === undefined || input.deliveryFeeOverride === null
      ? rules.deliveryFee
      : input.deliveryFeeOverride;

  if (deliveryFee < 0) throw new Error("deliveryFeeOverride négatif interdit.");

  const discount = input.discount ?? 0;
  if (discount < 0 || !Number.isInteger(discount)) {
    throw new Error(`discount invalide: ${discount}`);
  }

  const amountBeforePaymentFee = productSubtotal + deliveryFee - discount;
  if (amountBeforePaymentFee < 0) {
    throw new Error("La remise dépasse le montant total.");
  }

  const { total: customerTotal, fee: paymentFee } = grossUp(
    amountBeforePaymentFee,
    rules.paymentFeeRate,
  );

  return {
    sellerSubtotal,
    victoireCommission,
    productSubtotal,
    deliveryFee,
    discount,
    amountBeforePaymentFee,
    paymentFee,
    customerTotal,
    sellerPayout: sellerSubtotal,
    appliedRules: { ...rules },
  };
}

export const LAUNCH_PRICING_RULES: PricingRules = {
  commissionRate: 0.15,
  paymentFeeRate: 0.03,
  deliveryFee: 1000,
};

/* --------------------------- Types domaine ----------------------- */

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
