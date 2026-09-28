import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ProductListItem } from "@/lib/api";
import { gradientFor, initialsFor } from "@/lib/gradient";
import { formatFCFA } from "@/lib/format";
import { Badge, Icon } from "../ui";
import { useCart } from "@/store/cart";
import { useToast } from "../ui/Toast";

export function ProductCard({ product, index = 0 }: { product: ProductListItem; index?: number }) {
  const add = useCart((s) => s.add);
  const toast = useToast();
  const [c1, c2] = gradientFor(product.id);
  const out = product.stock <= 0;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (out) return;
    add(product.id, 1);
    toast.push(`${product.name} ajouté au panier`, "success");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
    >
      <Link
        to={`/produit/${product.id}`}
        className="group block bg-white rounded-[var(--r-lg)] border border-[var(--ink-100)] overflow-hidden shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--ink-200)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <div
            className="absolute inset-0 grid place-items-center transition-transform duration-500 group-hover:scale-[1.06]"
            style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
          >
            <span
              className="text-[38px] font-semibold tracking-tight text-white/90 drop-shadow-sm select-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {initialsFor(product.name)}
            </span>
          </div>

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {product.storeVerified && (
              <Badge tone="brand" icon={<Icon.Shield size={11} />}>Vérifiée</Badge>
            )}
            {out && <Badge tone="danger">Épuisé</Badge>}
            {!out && product.stock <= 5 && (
              <Badge tone="warning">Plus que {product.stock}</Badge>
            )}
          </div>

          <motion.button
            type="button"
            onClick={quickAdd}
            disabled={out}
            aria-label="Ajouter au panier"
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-2.5 right-2.5 w-10 h-10 grid place-items-center rounded-full bg-white/95 text-[var(--ink-900)] shadow-[var(--shadow-md)] backdrop-blur-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
          >
            <Icon.Plus />
          </motion.button>
        </div>

        <div className="p-3.5 flex flex-col gap-1">
          <p className="text-[13px] text-[var(--ink-500)] truncate">{product.storeName}</p>
          <h3 className="text-[15px] font-medium leading-snug line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
          <p
            className="mt-1 text-[16px] font-semibold text-[var(--ink-900)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {formatFCFA(product.sellerNetPrice)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
