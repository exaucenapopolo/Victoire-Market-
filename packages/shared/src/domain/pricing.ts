import { toFCFA, type FCFA } from "../money.js";

/**
 * Règles économiques appliquées à une commande.
 * Ces valeurs viennent de PlatformSetting et sont figées (snapshot)
 * dans la commande au moment de la transaction.
 */
export interface PricingRules {
  /** Commission Victoire, ex. 0.15 */
  commissionRate: number;
  /** Frais du prestataire de paiement, ex. 0.03 */
  paymentFeeRate: number;
  /** Frais de livraison standard par défaut */
  deliveryFee: FCFA;
}

export interface PricingLineInput {
  /** Prix net vendeur pour une unité, hors commission et hors frais. */
  sellerNetPrice: FCFA;
  quantity: number;
}

export interface PricingInput {
  lines: readonly PricingLineInput[];
  rules: PricingRules;
  /** Remplace le tarif de livraison par défaut (zones, promotions, retrait = 0). */
  deliveryFeeOverride?: FCFA | null;
  /** Remise accordée au client (déjà en FCFA). */
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

/**
 * Calcule le montant final lorsqu'un prestataire prélève un pourcentage
 * sur le montant encaissé (gross-up).
 *
 *   total = amountBefore / (1 - feeRate)
 *
 * On arrondit vers le haut pour garantir que le prélèvement reste couvert
 * même après arrondi bancaire côté prestataire.
 */
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

/**
 * Valeurs économiques de lancement (cf. cahier des charges §30).
 * Ce sont des DÉFAUTS. La source de vérité reste PlatformSetting en base.
 */
export const LAUNCH_PRICING_RULES: PricingRules = {
  commissionRate: 0.15,
  paymentFeeRate: 0.03,
  deliveryFee: 1000,
};
