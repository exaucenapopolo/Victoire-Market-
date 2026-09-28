import type {
  Category, Order, OrderStatus, Product, Store, SearchRequest,
  FulfillmentMethod, PricingBreakdown,
} from "@victoire/shared";
import { computePricing, LAUNCH_PRICING_RULES } from "@victoire/shared";
import {
  mockCategories, mockProducts, mockStores, mockStock,
  productById, storeById,
} from "./mock-data";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms));

export interface ProductListItem extends Product {
  storeName: string;
  storeVerified: boolean;
  stock: number;
  categoryName: string;
}

function enrich(p: Product): ProductListItem {
  const s = storeById(p.storeId);
  return {
    ...p,
    storeName: s?.name ?? "—",
    storeVerified: s?.verified ?? false,
    stock: mockStock[p.id] ?? 0,
    categoryName: mockCategories.find((c) => c.id === p.categoryId)?.name ?? "",
  };
}

export interface CheckoutPayload {
  items: Array<{ productId: string; quantity: number }>;
  fulfillment: FulfillmentMethod;
  contactName: string;
  contactPhone: string;
  deliveryAddress?: string;
  deliveryZoneId?: string;
}

export interface CheckoutResult {
  order: Order;
  pricing: PricingBreakdown;
}

export const api = {
  async listCategories(): Promise<Category[]> {
    if (!USE_MOCK) throw new Error("API réelle non configurée");
    await delay(120);
    return mockCategories;
  },

  async listProducts(params?: {
    q?: string; categoryId?: string; storeId?: string; limit?: number;
  }): Promise<ProductListItem[]> {
    if (!USE_MOCK) throw new Error("API réelle non configurée");
    await delay();
    let items = mockProducts.map(enrich);
    if (params?.categoryId) items = items.filter((p) => p.categoryId === params.categoryId);
    if (params?.storeId) items = items.filter((p) => p.storeId === params.storeId);
    if (params?.q) {
      const q = params.q.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.storeName.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q),
      );
    }
    if (params?.limit) items = items.slice(0, params.limit);
    return items;
  },

  async getProduct(id: string): Promise<ProductListItem | null> {
    if (!USE_MOCK) throw new Error("API réelle non configurée");
    await delay(180);
    const p = productById(id);
    return p ? enrich(p) : null;
  },

  async listStores(): Promise<Store[]> {
    if (!USE_MOCK) throw new Error("API réelle non configurée");
    await delay(140);
    return mockStores;
  },

  async getStore(id: string): Promise<{ store: Store; products: ProductListItem[] } | null> {
    if (!USE_MOCK) throw new Error("API réelle non configurée");
    await delay(200);
    const s = storeById(id);
    if (!s) return null;
    return { store: s, products: mockProducts.filter((p) => p.storeId === id).map(enrich) };
  },

  /**
   * Checkout : le prix final est TOUJOURS recalculé serveur.
   * En mode mock, on simule cette autorité côté client pour la démo.
   */
  async checkout(payload: CheckoutPayload): Promise<CheckoutResult> {
    if (!USE_MOCK) throw new Error("API réelle non configurée");
    await delay(650);

    const lines = payload.items.map((i) => {
      const p = productById(i.productId);
      if (!p) throw new Error(`Produit inconnu: ${i.productId}`);
      const stock = mockStock[p.id] ?? 0;
      if (stock < i.quantity) throw new Error(`Stock insuffisant pour ${p.name}`);
      return { sellerNetPrice: p.sellerNetPrice, quantity: i.quantity };
    });

    const pricing = computePricing({
      lines,
      rules: LAUNCH_PRICING_RULES,
      deliveryFeeOverride: payload.fulfillment === "PICKUP" ? 0 : undefined,
    });

    const order: Order = {
      id: `o_${Math.random().toString(36).slice(2, 9)}`,
      reference: `VIC-${Date.now().toString(36).toUpperCase()}`,
      status: "PAID" satisfies OrderStatus,
      fulfillment: payload.fulfillment,
      currency: "XAF",
      pricing: pricing.appliedRules,
      sellerSubtotal: pricing.sellerSubtotal,
      victoireCommission: pricing.victoireCommission,
      deliveryFee: pricing.deliveryFee,
      paymentFee: pricing.paymentFee,
      customerTotal: pricing.customerTotal,
      sellerPayout: pricing.sellerPayout,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { order, pricing };
  },

  async createSearchRequest(input: {
    productWanted: string; quantity: number; maxBudget?: number;
    notes?: string; contactPhone?: string;
  }): Promise<SearchRequest> {
    if (!USE_MOCK) throw new Error("API réelle non configurée");
    await delay(700);
    return {
      id: `sr_${Math.random().toString(36).slice(2, 9)}`,
      productWanted: input.productWanted,
      quantity: input.quantity,
      maxBudget: input.maxBudget,
      notes: input.notes,
      contactPhone: input.contactPhone,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };
  },
};
