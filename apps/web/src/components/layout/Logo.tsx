import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="Victoire Market — accueil">
      <span
        className="relative grid place-items-center w-9 h-9 rounded-[12px] bg-[var(--ink-900)] text-[var(--terra-400)] shadow-[var(--shadow-sm)] transition-transform group-hover:scale-105"
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 5h4l4 11 4-11h4l-6 15h-4L4 5Z" fill="currentColor" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-[var(--gold-500)] border-2 border-[var(--cream-100)]" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className="text-[17px] font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Victoire
          </span>
          <span className="text-[10px] font-semibold tracking-[0.18em] text-[var(--terra-700)] uppercase">
            Market
          </span>
        </span>
      )}
    </Link>
  );
}
