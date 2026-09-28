import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { computePricing, LAUNCH_PRICING_RULES, type FulfillmentMethod } from "@victoire/shared";
import { api, type ProductListItem } from "@/lib/api";
import { useEffect } from "react";
import { Button, Card, Divider, Icon, Input, Skeleton, Textarea } from "@/components/ui";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/ui/Toast";
import { formatFCFA } from "@/lib/format";
import { initialsFor } from "@/lib/gradient";

export function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const nav = useNavigate();
  const toast = useToast();
  const [products, setProducts] = useState<Record<string, ProductListItem> | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("DELIVERY");
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (lines.length === 0) return;
    Promise.all(lines.map((l) => api.getProduct(l.productId))).then((res) => {
      const map: Record<string, ProductListItem> = {};
      res.forEach((p) => { if (p) map[p.id] = p; });
      setProducts(map);
    });
  }, [lines.length]);

  const pricing = useMemo(() => {
    if (!products) return null;
    const valid = lines.filter((l) => products[l.productId]);
    if (valid.length === 0) return null;
    return computePricing({
      lines: valid.map((l) => ({
        sellerNetPrice: products[l.productId]!.sellerNetPrice,
        quantity: l.quantity,
      })),
      rules: LAUNCH_PRICING_RULES,
      deliveryFeeOverride: fulfillment === "PICKUP" ? 0 : undefined,
    });
  }, [products, lines, fulfillment]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.push("Renseigne ton nom et ton numéro", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.checkout({
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        fulfillment,
        contactName: form.name,
        contactPhone: form.phone,
        deliveryAddress: fulfillment === "DELIVERY" ? form.address : undefined,
        deliveryZoneId: fulfillment === "DELIVERY" ? "dz-standard" : undefined,
      });
      clear();
      toast.push("Paiement confirmé", "success");
      nav(`/commande/${res.order.id}`, { state: res });
    } catch (err) {
      toast.push(err instanceof Error ? err.message : "Erreur de paiement", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container pt-6 md:pt-10">
        <h1>Commander</h1>
        <p className="mt-3 text-[var(--ink-500)]">Ton panier est vide.</p>
        <Button className="mt-5" onClick={() => nav("/recherche")}>Explorer le marché</Button>
      </div>
    );
  }

  if (!products || !pricing) {
    return (
      <div className="container pt-6 md:pt-10 flex flex-col gap-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-48" rounded="var(--r-lg)" />
        <Skeleton className="h-64" rounded="var(--r-lg)" />
      </div>
    );
  }

  return (
    <div className="container pt-6 md:pt-10 grid lg:grid-cols-[1.6fr_1fr] gap-8">
      <form onSubmit={submit} className="flex flex-col gap-6">
        <div>
          <p className="eyebrow">Étape 1 / 2</p>
          <h1 className="mt-2">Finaliser la commande</h1>
          <p className="mt-1.5 text-[14px] text-[var(--ink-500)]">
            Aucune inscription obligatoire. Tu peux créer un compte après la commande.
          </p>
        </div>

        {/* Mode de réception */}
        <Card padded>
          <h3 className="!text-[15px] mb-3">Mode de réception</h3>
          <div className="grid grid-cols-2 gap-3">
            <ModeOption
              active={fulfillment === "DELIVERY"}
              onClick={() => setFulfillment("DELIVERY")}
              icon={<Icon.Truck size={18} />}
              title="Livraison"
              subtitle="1 000 FCFA · Bertoua"
            />
            <ModeOption
              active={fulfillment === "PICKUP"}
              onClick={() => setFulfillment("PICKUP")}
              icon={<Icon.Package size={18} />}
              title="Retrait boutique"
              subtitle="Gratuit · après paiement"
            />
          </div>
        </Card>

        {/* Coordonnées */}
        <Card padded>
          <h3 className="!text-[15px] mb-4">Tes coordonnées</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nom complet"
              placeholder="Ex. Marie Ngo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Téléphone"
              placeholder="Ex. 6 XX XX XX XX"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          {fulfillment === "DELIVERY" && (
            <div className="mt-4">
              <Textarea
                label="Adresse de livraison"
                placeholder="Quartier, point de repère…"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          )}
          <div className="mt-4">
            <Textarea
              label="Notes (optionnel)"
              placeholder="Précisions pour le vendeur ou le livreur…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </Card>

        {/* Paiement */}
        <Card padded>
          <h3 className="!text-[15px] mb-3">Paiement</h3>
          <div className="flex items-center gap-3 p-3.5 rounded-[var(--r-md)] bg-[var(--cream-50)] border border-[var(--ink-100)]">
            <span className="w-9 h-9 grid place-items-center rounded-full bg-[var(--terra-100)] text-[var(--terra-700)]">
              <Icon.Shield size={16} />
            </span>
            <div className="flex-1">
              <p className="text-[13.5px] font-medium">Paiement sécurisé Victoire</p>
              <p className="text-[12px] text-[var(--ink-400)]">
                Mobile Money · confirmé côté serveur
              </p>
            </div>
          </div>
          <p className="mt-3 text-[12px] text-[var(--ink-400)]">
            Le montant exact sera recalculé et confirmé par le serveur avant validation.
          </p>
        </Card>

        <div className="lg:hidden">
          <SummaryCard pricing={pricing} />
          <Button type="submit" size="lg" className="w-full mt-4" loading={submitting}>
            Payer {formatFCFA(pricing.customerTotal)}
          </Button>
        </div>
      </form>

      {/* Colonne récap (desktop) */}
      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--topbar-h)+20px)] flex flex-col gap-4">
          <Card padded>
            <h3 className="!text-[15px]">Ta commande</h3>
            <div className="mt-4 flex flex-col gap-3">
              {lines.map((l) => {
                const p = products[l.productId];
                if (!p) return null;
                return (
                  <div key={l.productId} className="flex items-center gap-3">
                    <span className="w-10 h-10 shrink-0 rounded-[10px] grid place-items-center bg-[var(--cream-200)] text-[12px] font-semibold"
                      style={{ fontFamily: "var(--font-display)" }}>
                      {initialsFor(p.name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium truncate">{p.name}</p>
                      <p className="text-[11.5px] text-[var(--ink-400)]">× {l.quantity}</p>
                    </div>
                    <span className="text-[13.5px] font-medium">
                      {formatFCFA(p.sellerNetPrice * l.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <SummaryCard pricing={pricing} />

          <Button type="submit" size="lg" className="w-full" loading={submitting}
            onClick={submit}>
            Payer {formatFCFA(pricing.customerTotal)}
          </Button>

          <p className="text-[11.5px] text-center text-[var(--ink-400)]">
            En payant, tu acceptes les conditions Victoire Market.
          </p>
        </div>
      </div>
    </div>
  );
}

function ModeOption({
  active, onClick, icon, title, subtitle,
}: {
  active: boolean; onClick: () => void;
  icon: React.ReactNode; title: string; subtitle: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={
        "relative flex flex-col items-start gap-2 p-4 rounded-[var(--r-md)] border text-left transition-colors " +
        (active
          ? "border-[var(--terra-600)] bg-[var(--terra-50)] "
          : "border-[var(--ink-200)] bg-white hover:border-[var(--ink-400)] ")
      }
    >
      <span className={
        "w-9 h-9 grid place-items-center rounded-full " +
        (active ? "bg-[var(--terra-600)] text-white" : "bg-[var(--ink-50)] text-[var(--ink-600)]")
      }>
        {icon}
      </span>
      <span>
        <span className="block text-[13.5px] font-medium">{title}</span>
        <span className="block text-[11.5px] text-[var(--ink-400)] mt-0.5">{subtitle}</span>
      </span>
      {active && (
        <motion.span
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-5 h-5 grid place-items-center rounded-full bg-[var(--terra-600)] text-white"
        >
          <Icon.Check size={12} />
        </motion.span>
      )}
    </motion.button>
  );
}

function SummaryCard({ pricing }: { pricing: ReturnType<typeof computePricing> }) {
  return (
    <Card padded>
      <h3 className="!text-[15px]">Détail du prix</h3>
      <div className="mt-4 flex flex-col gap-2.5 text-[13.5px]">
        <Row label="Sous-total vendeur" value={formatFCFA(pricing.sellerSubtotal)} />
        <Row label="Commission Victoire (15 %)" value={formatFCFA(pricing.victoireCommission)} />
        <Row
          label="Livraison"
          value={pricing.deliveryFee === 0 ? "Retrait · 0 FCFA" : formatFCFA(pricing.deliveryFee)}
        />
        <Row label="Frais de paiement (3 %)" value={formatFCFA(pricing.paymentFee)} />
        <Divider />
        <div className="flex justify-between items-baseline">
          <span className="font-medium">Total à payer</span>
          <span className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {formatFCFA(pricing.customerTotal)}
          </span>
        </div>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[var(--ink-500)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
