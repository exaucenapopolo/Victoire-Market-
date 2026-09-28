import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { Store } from "@victoire/shared";
import { api, type ProductListItem } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge, Card, Icon, Skeleton } from "@/components/ui";
import { initialsFor } from "@/lib/gradient";
import { EmptyState } from "@/components/common/EmptyState";

export function StorePage() {
  const { id = "" } = useParams();
  const [data, setData] = useState<{ store: Store; products: ProductListItem[] } | null | undefined>(undefined);
  useEffect(() => { setData(undefined); api.getStore(id).then(setData); }, [id]);

  if (data === undefined) {
    return (
      <div className="container pt-6 md:pt-10 flex flex-col gap-5">
        <Skeleton className="h-24" rounded="var(--r-xl)" />
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" rounded="var(--r-lg)" />)}
        </div>
      </div>
    );
  }
  if (!data) return <EmptyState title="Boutique introuvable" />;
  const { store, products } = data;

  return (
    <div className="container pt-6 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padded className="relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--terra-100)] blur-2xl" aria-hidden />
          <div className="relative flex items-start gap-4 flex-wrap">
            <span className="w-16 h-16 grid place-items-center rounded-[18px] bg-[var(--ink-900)] text-[var(--terra-400)] text-[20px] font-semibold"
              style={{ fontFamily: "var(--font-display)" }}>
              {initialsFor(store.name)}
            </span>
            <div className="flex-1 min-w-[200px]">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="!text-[22px] md:!text-[26px]">{store.name}</h1>
                {store.verified && <Badge tone="brand" icon={<Icon.Shield size={11} />}>Boutique vérifiée</Badge>}
                {store.hasPhysicalLocation && <Badge tone="neutral" icon={<Icon.MapPin size={11} />}>Local physique</Badge>}
              </div>
              <p className="mt-1.5 text-[14px] text-[var(--ink-500)] max-w-[640px]">{store.description}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-[var(--ink-400)]">
                <Icon.MapPin size={13} /> {store.generalArea}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="mt-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2>Produits ({products.length})</h2>
          <Link to="/recherche" className="text-[13px] text-[var(--terra-700)] font-medium hover:underline inline-flex items-center gap-1">
            Tout le marché <Icon.ChevronRight size={14} />
          </Link>
        </div>
        {products.length === 0 ? (
          <EmptyState title="Aucun produit publié" description="Cette boutique n'a pas encore ajouté de produit." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
