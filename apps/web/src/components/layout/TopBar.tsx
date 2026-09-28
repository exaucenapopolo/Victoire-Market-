import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Icon } from "../ui";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/recherche", label: "Produits" },
  { to: "/je-cherche", label: "Je cherche" },
  { to: "/boutiques", label: "Boutiques" },
];

export function TopBar() {
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const user = useAuth((s) => s.user);
  const nav = useNavigate();
  const loc = useLocation();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    nav(`/recherche${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--ink-100)] bg-[rgba(251,248,243,0.85)] backdrop-blur-xl">
      <div className="container h-[var(--topbar-h)] flex items-center gap-4 md:gap-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to);
            return (
              <NavLink
                key={n.to}
                to={n.to}
                className={
                  "relative px-3.5 h-9 inline-flex items-center rounded-full text-[13.5px] font-medium transition-colors " +
                  (active
                    ? "text-[var(--ink-900)] "
                    : "text-[var(--ink-500)] hover:text-[var(--ink-900)] ")
                }
              >
                {active && (
                  <motion.span
                    layoutId="topnav-pill"
                    className="absolute inset-0 rounded-full bg-[var(--ink-900)]/[0.06]"
                    transition={{ type: "spring", stiffness: 480, damping: 40 }}
                  />
                )}
                <span className="relative">{n.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <form
          onSubmit={submit}
          className="hidden lg:flex flex-1 max-w-[420px] ml-auto items-center gap-2 h-10 px-3.5 rounded-full bg-white border border-[var(--ink-200)] focus-within:border-[var(--terra-500)] transition-colors"
        >
          <Icon.Search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Qu'est-ce que tu cherches à Bertoua ?"
            className="flex-1 bg-transparent outline-none text-[13.5px] placeholder:text-[var(--ink-300)]"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Effacer"
              className="text-[var(--ink-400)] hover:text-[var(--ink-700)]">
              <Icon.Close size={14} />
            </button>
          )}
        </form>

        <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
          <NavLink
            to="/panier"
            aria-label="Panier"
            className="relative w-10 h-10 grid place-items-center rounded-full text-[var(--ink-700)] hover:bg-[var(--ink-50)] transition-colors"
          >
            <Icon.Cart size={20} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-[var(--terra-600)] text-white text-[10.5px] font-bold tabular-nums"
              >
                {cartCount}
              </motion.span>
            )}
          </NavLink>

          <NavLink
            to={user ? "/compte" : "/connexion"}
            aria-label={user ? "Mon compte" : "Se connecter"}
            className="hidden md:grid w-10 h-10 place-items-center rounded-full text-[var(--ink-700)] hover:bg-[var(--ink-50)] transition-colors"
          >
            {user ? (
              <span className="w-8 h-8 grid place-items-center rounded-full bg-[var(--ink-900)] text-[var(--cream-50)] text-[12px] font-semibold">
                {(user.name ?? user.email)[0]?.toUpperCase()}
              </span>
            ) : (
              <Icon.User size={20} />
            )}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
