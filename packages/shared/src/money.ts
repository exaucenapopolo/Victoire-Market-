/**
 * Le FCFA n'a pas de sous-unité en pratique.
 * Tous les montants manipulés dans Victoire sont des entiers de francs.
 */
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
