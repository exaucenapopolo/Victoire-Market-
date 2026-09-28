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

/**
 * Transitions autorisées. Toute transition non listée doit être rejetée côté serveur.
 * Règle structurante : impossible d'atteindre COMPLETED sans PICKED_UP ou DELIVERED.
 */
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
