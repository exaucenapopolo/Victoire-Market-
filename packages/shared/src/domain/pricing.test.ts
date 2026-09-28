import { describe, expect, it } from "vitest";
import { computePricing, grossUp, LAUNCH_PRICING_RULES } from "./pricing.js";

describe("grossUp", () => {
  it("couvre les 3% sans perte pour Victoire", () => {
    const { total, fee } = grossUp(24_000, 0.03);
    expect(total).toBe(24_743);
    expect(fee).toBe(743);
    // Le prélèvement du prestataire ne doit jamais dépasser ce qui est facturé.
    expect(total * 0.03).toBeLessThanOrEqual(fee);
  });

  it("rejette un taux hors [0,1[", () => {
    expect(() => grossUp(1000, 1)).toThrow();
    expect(() => grossUp(1000, -0.01)).toThrow();
  });
});

describe("computePricing - cas de référence 20 000 FCFA", () => {
  const breakdown = computePricing({
    lines: [{ sellerNetPrice: 20_000, quantity: 1 }],
    rules: LAUNCH_PRICING_RULES,
  });

  it("conserve le prix net vendeur", () => {
    expect(breakdown.sellerPayout).toBe(20_000);
    expect(breakdown.sellerSubtotal).toBe(20_000);
  });

  it("calcule une commission de 15 %", () => {
    expect(breakdown.victoireCommission).toBe(3_000);
    expect(breakdown.productSubtotal).toBe(23_000);
  });

  it("ajoute la livraison standard", () => {
    expect(breakdown.deliveryFee).toBe(1_000);
    expect(breakdown.amountBeforePaymentFee).toBe(24_000);
  });

  it("couvre les frais de paiement par gross-up", () => {
    expect(breakdown.paymentFee).toBe(743);
    expect(breakdown.customerTotal).toBe(24_743);
  });

  it("conserve un instantané des règles appliquées", () => {
    expect(breakdown.appliedRules).toEqual(LAUNCH_PRICING_RULES);
  });
});

describe("computePricing - cas limites", () => {
  it("quantité multiple", () => {
    const b = computePricing({
      lines: [{ sellerNetPrice: 5_000, quantity: 3 }],
      rules: LAUNCH_PRICING_RULES,
    });
    expect(b.sellerSubtotal).toBe(15_000);
    expect(b.victoireCommission).toBe(2_250);
    expect(b.sellerPayout).toBe(15_000);
  });

  it("retrait en boutique = livraison 0", () => {
    const b = computePricing({
      lines: [{ sellerNetPrice: 10_000, quantity: 1 }],
      rules: LAUNCH_PRICING_RULES,
      deliveryFeeOverride: 0,
    });
    expect(b.deliveryFee).toBe(0);
    expect(b.amountBeforePaymentFee).toBe(11_500);
  });

  it("remise supérieure au total rejetée", () => {
    expect(() =>
      computePricing({
        lines: [{ sellerNetPrice: 1_000, quantity: 1 }],
        rules: LAUNCH_PRICING_RULES,
        discount: 999_999,
      }),
    ).toThrow();
  });

  it("rejette une quantité nulle ou négative", () => {
    expect(() =>
      computePricing({
        lines: [{ sellerNetPrice: 1_000, quantity: 0 }],
        rules: LAUNCH_PRICING_RULES,
      }),
    ).toThrow();
  });

  it("rejette un prix vendeur non entier", () => {
    expect(() =>
      computePricing({
        lines: [{ sellerNetPrice: 1_000.5, quantity: 1 }],
        rules: LAUNCH_PRICING_RULES,
      }),
    ).toThrow();
  });
});
