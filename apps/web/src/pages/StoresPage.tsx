import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Store } from "@victoire/shared";
import { api } from "@/lib/api";
import { Card, Icon, Skeleton } from "@/components/ui";
import { initialsFor } from "@/lib/gradient";

export function StoresPage() {
  const [stores, setStores] = useState<Store[] | null>(null);
  useEffect(() => { api.listStores().then(setStores); }, []);

  return (
    <div className="container pt-6 md:pt-10">
      <p className="eyebrow">Boutiques</p>
      <h1 className="mt-2">Les commerces de Bertoua</h1>
      <p className="mt-2 text-[14.5px] text-[var(--ink-500)] max-w-[600px]">
        Chaque boutique conserve son activité physique. Victoire lui ajoute un canal de vente en ligne.
      </p>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!stores
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" rounded="var(--r-lg)" />
            ))
          : stores.map((s, i) => (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
              >
                <Link to={`/boutique/${s.id}`}>
                  <Card interactive className="h-full flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 grid place-items-center rounded-[14px] bg-[var(--cream-200)] font-semibold text-[16px]"
                        style={{ fontFamily: "var(--font-display)" }}>
                        {initialsFor(s.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium truncate">{s.name}</p>
                          {s.verified && <span className="text-[var(--terra-700)]"><Icon.Shield size={14} /></span>}
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-400)] truncate">{s.generalArea}</p>
                      </div>
                      <Icon.ChevronRight size={16} />
                    </div>
                    <p className="text-[13.5px] text-[var(--ink-500)] line-clamp-2">{s.description}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
