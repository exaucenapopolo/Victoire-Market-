import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { ProductListItem } from "@/lib/api";
import { api } from "@/lib/api";
import { gradientFor, initialsFor } from "@/lib/gradient";
import { formatFCFA } from "@/lib/format";
import { Button, Card, Divider, Icon, LinkButton, QuantityControl, Skeleton } from "@/components/ui";
import { useCart } from "@/store/cart";
import { computePricing, LAUNCH_PRICING_RULES } from "@victoire/shared";
import { EmptyState } from "@/components/common/EmptyState";

export function CartPage() {
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const [products, setProducts] = useState<Record<string, ProductListItem> | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (lines.length === 0) { setProducts({}); return; }
    Promise.all(lines.map((l) => api.getProduct(l.productId))).then((res) => {
      const map: Record<string, ProductListItem> = {};
      res.forEach((p) => { if (p) map[p.id] = p; });
      setProducts(map);
    });
  }, [lines.length]);

  if (lines.length === 0) {
    return (
      <div className="container pt-6 md:pt-10">
        <h1>Panier</h1>
        <EmptyState
          title="Ton panier est vide"
          description="Explore le marché de Bertoua et ajoute ce qui te plaît."
          action={<LinkButton to="/recherche">Explorer le marché</LinkButton>}
        />
      </div>
    );
  }

  if (!products) {
    return (
      <div className="container pt-6 md:pt-10 flex flex-col gap-4">
        <h1>Panier</h1>
        {Array.from({ length: lines.length }).map((_, i) => (
          <Skeleton key={i} className="h-24" rounded="var(--r-lg)" />
        ))}
      </div>
    );
  }

  // Calcul côté client uniquement pour l'aperçu — le serveur fait foi au checkout.
  const valid = lines.filter((l) => products[l.productId]);
  const pricing = valid.length > 0 ? computePricing({
    lines: valid.map((l) => ({
      sellerNetPrice: products[l.productId]!.sellerNetPrice,
      quantity: l.quantity,
    })),
    rules: LAUNCH_PRICING_RULES,
    deliveryFeeOverride: 0,
  }) : null;

  return (
    <div className="container pt-6 md:pt-10 grid lg:grid-cols-[1.6fr_1fr] gap-8">
      <div>
        <h1>Panier</h1>
        <p className="mt-1 text-[13px] text-[var(--ink-400)]">
          {lines.length} article{lines.length > 1 ? "s" : ""}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {lines.map((line) => {
              const p = products[line.productId];
              if (!p) return null;
              const [c1, c2] = gradientFor(p.id);
              return (
                <motion.div
                  key={line.productId}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Card padded={false} className="overflow-hidden">
                    <div className="flex gap-4 p-3">
                      <Link to={`/produit/${p.id}`}
                        className="w-20 h-20 shrink-0 rounded-[12px] grid place-items-center"
                        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                        <span className="text-[20px] text-white font-semibold"
                          style={{ fontFamily: "var(--font-display)" }}>
                          {initialsFor(p.name)}
                        </span>
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <Link to={`/produit/${p.id}`}
                          className="text-[14.5px] font-medium leading-snug line-clamp-2 hover:text-[var(--terra-700)]">
                          {p.name}
                        </Link>
                        <p className="text-[12px] text-[var(--ink-400)] mt-0.5">{p.storeName}</p>
                        <p className="mt-auto text-[15px] font-semibold"
                          style={{ fontFamily: "var(--font-display)" }}>
                          {formatFCFA(p.sellerNetPrice)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => remove(line.productId)}
                          className="text-[var(--ink-300)] hover:text-[var(--red-600)] p-1"
                          aria-label="Retirer"
                        >
                          <Icon.Trash />
                        </button>
                        <QuantityControl
                          value={line.quantity}
                          onChange={(v) => setQuantity(line.productId, v)}
                          max={Math.max(1, p.stock)}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Résumé */}
      <div>
        <Card padded className="lg:sticky lg:top-[calc(var(--topbar-h)+20px)]">
          <h3 className="!text-[16px]">Récapitulatif</h3>
          <div className="mt-4 flex flex-col gap-3 text-[14px]">
            <Row label="Sous-total vendeur" value={formatFCFA(pricing!.sellerSubtotal)} />
            <Row label="Commission Victoire (15 %)" value={formatFCFA(pricing!.victoireCommission)} />
            <div className="flex justify-between text-[var(--ink-500)]">
              <span>Livraison</span>
              <span className="italic">calculée au checkout</span>
            </div>
            <div className="flex justify-between text-[var(--ink-500)]">
              <span>Frais de paiement (3 %)</span>
              <span className="italic">calculés au checkout</span>
            </div>
            <Divider />
            <Row
              label="Total estimé"
              value={formatFCFA(pricing!.productSubtotal)}
              bold
            />
          </div>

          <Button
            size="lg"
            className="w-full mt-5"
            onClick={() => nav("/checkout")}
          >
            Passer au paiement
          </Button>
          <p className="mt-3 text-[11.5px] text-center text-[var(--ink-400)]">
            Le montant final est calculé par le serveur Victoire.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[var(--ink-500)]">{label}</span>
      <span
        className={bold ? "font-semibold text-[16px]" : ""}
        style={bold ? { fontFamily: "var(--font-display)" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
