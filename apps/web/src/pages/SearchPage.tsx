import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, type ProductListItem } from "@/lib/api";
import type { Category } from "@victoire/shared";
import { ProductCard } from "@/components/product/ProductCard";
import { Chip, Icon, Input, Skeleton } from "@/components/ui";
import { EmptyState } from "@/components/common/EmptyState";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState<string | null>(params.get("cat"));
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.listCategories().then(setCategories); }, []);

  useEffect(() => {
    setLoading(true);
    api.listProducts({ q: q || undefined, categoryId: cat ?? undefined }).then((r) => {
      setItems(r);
      setLoading(false);
    });
  }, [q, cat]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (cat) next.set("cat", cat);
    setParams(next, { replace: true });
  }, [q, cat, setParams]);

  const count = useMemo(() => items.length, [items]);

  return (
    <div className="container pt-6 md:pt-10">
      <div className="max-w-[720px]">
        <p className="eyebrow">Recherche</p>
        <h1 className="mt-2">Explorer le marché</h1>
        <p className="mt-2 text-[14.5px] text-[var(--ink-500)]">
          Parcours libre. Aucune inscription nécessaire.
        </p>
        <div className="mt-5">
          <Input
            placeholder="Produit, boutique, mot-clé…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            leading={<Icon.Search />}
            trailing={q ? (
              <button onClick={() => setQ("")} aria-label="Effacer"><Icon.Close size={14} /></button>
            ) : undefined}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap">
        <Chip active={cat === null} onClick={() => setCat(null)}>Toutes</Chip>
        {categories.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.name}</Chip>
        ))}
      </div>

      <div className="mt-6 mb-3 flex items-baseline justify-between">
        <p className="text-[13px] text-[var(--ink-400)]">
          {loading ? "Recherche…" : `${count} résultat${count > 1 ? "s" : ""}`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-[4/3]" rounded="var(--r-lg)" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucun résultat"
          description="Essaie un autre mot-clé, change de catégorie, ou lance une recherche personnalisée."
          action={
            <a href="/je-cherche"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--terra-600)] text-white font-medium">
              <Icon.Sparkle size={16} /> Je cherche
            </a>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
