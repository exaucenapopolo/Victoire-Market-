import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api, type ProductListItem } from "@/lib/api";
import { gradientFor, initialsFor } from "@/lib/gradient";
import { formatFCFA } from "@/lib/format";
import {
  Badge, Button, Card, Divider, Icon, LinkButton, QuantityControl, Skeleton,
} from "@/components/ui";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/common/EmptyState";

export function ProductPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState<ProductListItem | null | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const toast = useToast();

  useEffect(() => {
    setP(undefined);
    api.getProduct(id).then(setP);
  }, [id]);

  if (p === undefined) {
    return (
      <div className="container pt-6 md:pt-10 grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square" rounded="var(--r-xl)" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <EmptyState
        title="Produit introuvable"
        description="Ce produit n'est plus disponible."
        action={<LinkButton to="/recherche">Retour au catalogue</LinkButton>}
      />
    );
  }

  const [c1, c2] = gradientFor(p.id);
  const out = p.stock <= 0;

  function onAdd() {
    add(p!.id, qty);
    toast.push(`${p!.name} ajouté au panier`, "success");
  }
  function onBuyNow() {
    add(p!.id, qty);
    nav("/panier");
  }

  return (
    <div className="container pt-6 md:pt-10">
      <nav className="mb-5 text-[12.5px] text-[var(--ink-400)] flex items-center gap-1.5">
        <Link to="/" className="hover:text-[var(--ink-700)]">Accueil</Link>
        <Icon.ChevronRight size={12} />
        <Link to="/recherche" className="hover:text-[var(--ink-700)]">Produits</Link>
        <Icon.ChevronRight size={12} />
        <span className="text-[var(--ink-700)] truncate">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square rounded-[var(--r-xl)] overflow-hidden shadow-[var(--shadow-md)]"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-[80px] md:text-[110px] text-white/95 font-semibold"
              style={{ fontFamily: "var(--font-display)" }}>
              {initialsFor(p.name)}
            </span>
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            {p.storeVerified && <Badge tone="brand" icon={<Icon.Shield size={11} />}>Boutique vérifiée</Badge>}
          </div>
        </motion.div>

        <div className="flex flex-col">
          <Link to={`/boutique/${p.storeId}`}
            className="inline-flex items-center gap-1 text-[13px] text-[var(--terra-700)] font-medium hover:underline">
            {p.storeName} <Icon.ChevronRight size={12} />
          </Link>
          <h1 className="mt-2">{p.name}</h1>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-[30px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {formatFCFA(p.sellerNetPrice)}
            </p>
            <span className="text-[12px] text-[var(--ink-400)]">prix net vendeur</span>
          </div>

          <div className="mt-3 flex gap-2">
            {out
              ? <Badge tone="danger">Rupture de stock</Badge>
              : p.stock <= 5
                ? <Badge tone="warning">Plus que {p.stock} en stock</Badge>
                : <Badge tone="success">{p.stock} en stock</Badge>}
            {p.deliveryAvailable && <Badge tone="neutral" icon={<Icon.Truck size={11} />}>Livraison</Badge>}
            {p.pickupAvailable && <Badge tone="neutral" icon={<Icon.Package size={11} />}>Retrait</Badge>}
          </div>

          {p.description && (
            <>
              <Divider className="my-6" />
              <p className="text-[14.5px] text-[var(--ink-600)] leading-relaxed">{p.description}</p>
            </>
          )}

          <Divider className="my-6" />

          <Card padded className="bg-[var(--cream-50)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[12.5px] text-[var(--ink-400)] mb-1">Quantité</p>
                <QuantityControl value={qty} onChange={setQty} max={Math.max(1, p.stock)} />
              </div>
              <div className="text-right">
                <p className="text-[12.5px] text-[var(--ink-400)] mb-1">Sous-total</p>
                <p className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  {formatFCFA(p.sellerNetPrice * qty)}
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={onAdd} disabled={out}
              iconLeft={<Icon.Cart size={16} />}>
              Ajouter
            </Button>
            <Button size="lg" onClick={onBuyNow} disabled={out}>
              Acheter maintenant
            </Button>
          </div>

          <ul className="mt-6 space-y-2 text-[13px] text-[var(--ink-500)]">
            <li className="flex items-center gap-2"><Icon.Shield size={14} /> Paiement sécurisé Victoire</li>
            <li className="flex items-center gap-2"><Icon.Truck size={14} /> Livraison standard 1 000 FCFA à Bertoua</li>
            <li className="flex items-center gap-2"><Icon.Package size={14} /> Retrait possible après paiement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
