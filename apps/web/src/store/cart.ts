import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (productId, quantity = 1) =>
        set((s) => {
          const i = s.lines.findIndex((l) => l.productId === productId);
          if (i === -1) return { lines: [...s.lines, { productId, quantity }] };
          const next = [...s.lines];
          next[i] = { ...next[i]!, quantity: next[i]!.quantity + quantity };
          return { lines: next };
        }),
      remove: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((s) => ({
          lines: quantity <= 0
            ? s.lines.filter((l) => l.productId !== productId)
            : s.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
        })),
      clear: () => set({ lines: [] }),
      totalItems: () => get().lines.reduce((n, l) => n + l.quantity, 0),
    }),
    { name: "victoire.cart" },
  ),
);
