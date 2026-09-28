import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { api, type ProductListItem } from "@/lib/api";
import type { Category, Store } from "@victoire/shared";
import { ProductCard } from "@/components/product/ProductCard";
import { Card, Chip, Icon, Skeleton, LinkButton } from "@/components/ui";
import { gradientFor, initialsFor } from "@/lib/gradient";

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.listCategories(),
      api.listProducts({ limit: 12 }),
      api.listStores(),
    ]).then(([c, p, s]) => {
      if (!mounted) return;
      setCategories(c);
      setProducts(p);
      setStores(s);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filtered = activeCat
    ? products.filter((p) => p.categoryId === activeCat)
    : products;

  return (
    <div className="flex flex-col">
      {/* ---------------- HERO ---------------- */}
      <section className="container pt-8 md:pt-14 pb-10 md:pb-14">
        <div className="grid md:grid-cols-[1.15fr_1fr] gap-10 md:gap-12 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="eyebrow"
            >
              Bertoua · Cameroun
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-3"
            >
              Qu'est-ce que tu cherches <br className="hidden md:block" />
              <span className="text-[var(--terra-700)]">à Bertoua ?</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-4 text-[15px] md:text-[16px] text-[var(--ink-500)] max-w-[480px] leading-relaxed"
            >
              Trouve, commande, paie et fais-toi livrer — ou retire dans la boutique.
              Si le produit n'est pas encore là, Victoire le cherche pour toi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <LinkButton to="/recherche" size="lg" iconRight={<Icon.ChevronRight />}>
                Explorer le marché
              </LinkButton>
              <LinkButton to="/je-cherche" variant="outline" size="lg" iconLeft={<Icon.Sparkle size={16} />}>
                Je cherche un produit
              </LinkButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex items-center gap-5 text-[12.5px] text-[var(--ink-400)]"
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon.Shield size={14} /> Boutiques vérifiées
              </span>
              <span className="w-px h-4 bg-[var(--ink-200)]" />
              <span className="inline-flex items-center gap-1.5">
                <Icon.Truck size={14} /> Livraison 1 000 FCFA
              </span>
            </motion.div>
          </div>

          {/* Aperçu visuel "app" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden md:block"
          >
            <div className="relative aspect-[5/4] rounded-[var(--r-2xl)] overflow-hidden shadow-[var(--shadow-lg)] bg-white border border-[var(--ink-100)] p-5">
              <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                {products.slice(0, 4).map((p, i) => {
                  const [c1, c2] = gradientFor(p.id);
                  return (
                    <div
                      key={p.id}
                      className="rounded-[var(--r-md)] overflow-hidden relative"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    >
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="text-white/95 text-[26px] font-semibold"
                          style={{ fontFamily: "var(--font-display)" }}>
                          {initialsFor(p.name)}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-[10px] px-2.5 py-1.5">
                        <p className="text-[10.5px] text-[var(--ink-500)] truncate">{p.storeName}</p>
                        <p className="text-[12.5px] font-semibold truncate">{p.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="absolute -bottom-4 -right-4 w-[120px] h-[120px] rounded-full bg-[var(--gold-500)]/20 blur-2xl" aria-hidden />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="container">
        <div className="flex items-baseline justify-between mb-4">
          <h2>Catégories</h2>
          <Link to="/recherche" className="text-[13px] font-medium text-[var(--terra-700)] hover:underline inline-flex items-center gap-1">
            Tout voir <Icon.ChevronRight size={14} />
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap">
          <Chip active={activeCat === null} onClick={() => setActiveCat(null)}>Tous</Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>
      </section>

      {/* ---------------- PRODUITS ---------------- */}
      <section className="container mt-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2>Populaires sur le marché</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-[4/3]" rounded="var(--r-lg)" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        {!loading && filtered.length === 0 && (
          <p className="text-center py-10 text-[var(--ink-400)]">
            Aucun produit dans cette catégorie pour le moment.
          </p>
        )}
      </section>

      {/* ---------------- BOUTIQUES ---------------- */}
      <section className="container mt-14">
        <div className="flex items-baseline justify-between mb-4">
          <h2>Boutiques de Bertoua</h2>
          <Link to="/boutiques" className="text-[13px] font-medium text-[var(--terra-700)] hover:underline inline-flex items-center gap-1">
            Tout voir <Icon.ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.slice(0, 6).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
            >
              <Link to={`/boutique/${s.id}`}>
                <Card interactive padded className="h-full flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 grid place-items-center rounded-[14px] bg-[var(--cream-200)] text-[var(--ink-900)] font-semibold text-[15px]"
                      style={{ fontFamily: "var(--font-display)" }}>
                      {initialsFor(s.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{s.name}</p>
                      <p className="text-[12.5px] text-[var(--ink-400)] truncate">{s.generalArea}</p>
                    </div>
                    {s.verified && <Icon.Shield size={16} />}
                  </div>
                  <p className="text-[13.5px] text-[var(--ink-500)] line-clamp-2">{s.description}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- JE CHERCHE CTA ---------------- */}
      <section className="container mt-16 mb-8">
        <div className="relative overflow-hidden rounded-[var(--r-2xl)] bg-[var(--ink-900)] text-[var(--cream-50)] p-8 md:p-12">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--terra-600)]/25 blur-3xl" aria-hidden />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-[var(--gold-500)]/15 blur-3xl" aria-hidden />
          <div className="relative max-w-[560px]">
            <p className="eyebrow !text-[var(--terra-400)]">Fonction signature</p>
            <h2 className="mt-3 !text-[var(--cream-50)]">
              Tu ne trouves pas ce que tu cherches ?
            </h2>
            <p className="mt-3 text-[15px] text-[var(--cream-200)]/80">
              Dis-nous ce que tu veux. Victoire le cherche auprès de ses commerçants et partenaires,
              puis te revient avec une offre.
            </p>
            <div className="mt-6">
              <LinkButton to="/je-cherche" size="lg" iconLeft={<Icon.Sparkle size={16} />}>
                Lancer une recherche
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
