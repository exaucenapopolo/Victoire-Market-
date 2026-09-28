import { motion } from "framer-motion";
import { useLocation, useParams, Navigate } from "react-router-dom";
import type { Order, PricingBreakdown } from "@victoire/shared";
import { Card, Divider, Icon, LinkButton } from "@/components/ui";
import { formatFCFA } from "@/lib/format";

interface State { order: Order; pricing: PricingBreakdown }

export function ConfirmationPage() {
  const { id = "" } = useParams();
  const loc = useLocation();
  const state = loc.state as State | null;
  if (!state) return <Navigate to="/" replace />;

  const { order } = state;

  return (
    <div className="container pt-8 md:pt-16 max-w-[720px]">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="w-20 h-20 mx-auto grid place-items-center rounded-full bg-[var(--green-100)] text-[var(--green-800)]"
      >
        <Icon.Check size={36} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center mt-6"
      >
        <p className="eyebrow">Commande confirmée</p>
        <h1 className="mt-2">Merci ! Ta commande est enregistrée.</h1>
        <p className="mt-3 text-[14.5px] text-[var(--ink-500)]">
          Référence <span className="mono font-semibold text-[var(--ink-900)]">{order.reference}</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mt-8"
      >
        <Card padded>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 grid place-items-center rounded-full bg-[var(--terra-100)] text-[var(--terra-700)]">
              {order.fulfillment === "PICKUP" ? <Icon.Package /> : <Icon.Truck />}
            </span>
            <div>
              <p className="font-medium text-[14px]">
                {order.fulfillment === "PICKUP" ? "Retrait en boutique" : "Livraison à Bertoua"}
              </p>
              <p className="text-[12px] text-[var(--ink-400)]">
                Statut : <span className="mono">{order.status}</span>
              </p>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <Line label="Sous-total vendeur" value={formatFCFA(order.sellerSubtotal)} />
            <Line label="Commission Victoire" value={formatFCFA(order.victoireCommission)} />
            <Line label="Livraison" value={formatFCFA(order.deliveryFee)} />
            <Line label="Frais de paiement" value={formatFCFA(order.paymentFee)} />
            <Divider />
            <div className="flex justify-between items-baseline">
              <span className="font-medium">Total payé</span>
              <span className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {formatFCFA(order.customerTotal)}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <LinkButton to="/" variant="outline" size="lg">Retour au marché</LinkButton>
        <LinkButton to="/compte" size="lg">Voir mes commandes</LinkButton>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[var(--ink-500)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
