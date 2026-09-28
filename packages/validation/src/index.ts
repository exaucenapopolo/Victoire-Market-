import { z } from "zod";

const fcfa = z.number().int().nonnegative();

export const emailSchema = z.string().trim().toLowerCase().email("E-mail invalide");
export const passwordSchema = z.string().min(8, "8 caractères minimum").max(200);

// --- Compte client minimal (cf. §2.2)
export const customerSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type CustomerSignup = z.infer<typeof customerSignupSchema>;

// --- Compte vendeur (cf. §2.3)
export const sellerSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().trim().min(2).max(120),
  storeName: z.string().trim().min(2).max(120).optional(),
});
export type SellerSignup = z.infer<typeof sellerSignupSchema>;

// --- Boutique
export const storeCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional(),
  generalArea: z.string().trim().max(120).optional(),
  hasPhysicalLocation: z.boolean().default(false),
});
export type StoreCreate = z.infer<typeof storeCreateSchema>;

// --- Produit
export const productCreateSchema = z.object({
  storeId: z.string().min(1),
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().max(4000).optional(),
  sellerNetPrice: fcfa.min(1, "Le prix doit être supérieur à 0"),
  categoryId: z.string().optional(),
  pickupAvailable: z.boolean().default(true),
  deliveryAvailable: z.boolean().default(true),
  initialStock: z.number().int().nonnegative().default(0),
});
export type ProductCreate = z.infer<typeof productCreateSchema>;

// --- Ligne de panier (entrée client, jamais source de vérité pour le prix)
export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

// --- Checkout invité (cf. §5.4)
export const checkoutSchema = z
  .object({
    items: z.array(cartItemSchema).min(1),
    fulfillment: z.enum(["PICKUP", "DELIVERY"]),
    contactName: z.string().trim().min(2).max(120),
    contactPhone: z.string().trim().min(6).max(30),
    deliveryZoneId: z.string().optional(),
    deliveryAddress: z.string().trim().max(300).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment === "DELIVERY" && !data.deliveryZoneId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deliveryZoneId"],
        message: "Zone de livraison requise pour une livraison.",
      });
    }
  });
export type CheckoutInput = z.infer<typeof checkoutSchema>;

// --- Je cherche (cf. §7.2)
export const searchRequestSchema = z.object({
  productWanted: z.string().trim().min(2).max(200),
  quantity: z.number().int().positive().default(1),
  maxBudget: fcfa.optional(),
  photoUrl: z.string().url().optional(),
  notes: z.string().trim().max(1000).optional(),
  desiredDelay: z.string().trim().max(120).optional(),
  contactPhone: z.string().trim().min(6).max(30).optional(),
});
export type SearchRequestInput = z.infer<typeof searchRequestSchema>;

// --- Paramètres plateforme (administration)
export const platformPricingSettingsSchema = z.object({
  commissionRate: z.number().min(0).max(1),
  paymentFeeRate: z.number().min(0).max(1),
  defaultDeliveryFee: fcfa,
  storeVerificationFee: fcfa,
  storeVerificationMonths: z.number().int().positive(),
});
export type PlatformPricingSettings = z.infer<typeof platformPricingSettingsSchema>;
