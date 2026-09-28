import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "../ui";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";

const ITEMS = [
  { to: "/", label: "Accueil", icon: Icon.Home, exact: true },
  { to: "/recherche", label: "Produits", icon: Icon.Search },
  { to: "/je-cherche", label: "Je cherche", icon: Icon.Sparkle },
  { to: "/panier", label: "Panier", icon: Icon.Cart, cart: true },
  { to: "/compte", label: "Compte", icon: Icon.User, auth: true },
];

export function BottomNav() {
  const loc = useLocation();
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const user = useAuth((s) => s.user);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--ink-100)] bg-[rgba(251,248,243,0.92)] backdrop-blur-xl"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="grid grid-cols-5 h-[var(--bottomnav-h)]">
        {ITEMS.map((it) => {
          const active = it.exact ? loc.pathname === it.to : loc.pathname.startsWith(it.to);
          const href = it.auth && !user ? "/connexion" : it.to;
          return (
            <NavLink
              key={it.to}
              to={href}
              className="relative flex flex-col items-center justify-center gap-1 text-[10.5px] font-medium"
            >
              <span
                className={
                  "relative grid place-items-center w-10 h-8 rounded-full transition-colors " +
                  (active
                    ? "bg-[var(--ink-900)] text-[var(--cream-50)] "
                    : "text-[var(--ink-500)] ")
                }
              >
                <it.icon size={18} />
                {it.cart && cartCount > 0 && (
                  <span className="absolute -top-0.5 right-1 min-w-[16px] h-4 px-1 grid place-items-center rounded-full bg-[var(--terra-600)] text-white text-[9.5px] font-bold">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className={active ? "text-[var(--ink-900)]" : "text-[var(--ink-500)]"}>
                {it.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
