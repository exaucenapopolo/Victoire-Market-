import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Link } from "react-router-dom";

/* ---------------------------------- Button ---------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const btnBase =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition select-none " +
  "disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--terra-600)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--terra-700)] active:scale-[0.98]",
  secondary:
    "bg-[var(--ink-900)] text-[var(--cream-50)] hover:bg-[var(--ink-800)] active:scale-[0.98]",
  outline:
    "bg-white text-[var(--ink-900)] border border-[var(--ink-200)] hover:border-[var(--ink-400)] hover:bg-[var(--cream-50)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--ink-700)] hover:bg-[var(--ink-50)] active:scale-[0.98]",
  danger:
    "bg-[var(--red-600)] text-white hover:bg-[var(--red-700)] active:scale-[0.98]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-13 px-7 text-[15px] py-3.5",
};

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  variant = "primary", size = "md", loading, iconLeft, iconRight,
  children, className = "", disabled, ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`${btnBase} ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size={16} /> : iconLeft}
      {children}
      {!loading && iconRight}
    </motion.button>
  );
}

export function LinkButton({
  to, variant = "primary", size = "md", iconLeft, iconRight, className = "", children,
}: {
  to: string; variant?: ButtonVariant; size?: ButtonSize;
  iconLeft?: React.ReactNode; iconRight?: React.ReactNode;
  className?: string; children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`${btnBase} ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  );
}

/* --------------------------------- Spinner ---------------------------------- */

export function Spinner({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      style={{ animation: "vm-spin 700ms linear infinite" }}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity={0.25}
        strokeWidth="3" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="3"
        strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ----------------------------------- Card ----------------------------------- */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  interactive?: boolean;
  as?: "div" | "article" | "section";
}

export function Card({ children, className = "", padded = true, interactive = false, as = "div" }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={
        "bg-white rounded-[var(--r-lg)] border border-[var(--ink-100)] " +
        "shadow-[var(--shadow-xs)] " +
        (padded ? "p-5 " : "") +
        (interactive
          ? "transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 hover:border-[var(--ink-200)] "
          : "") +
        className
      }
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------- Badge ----------------------------------- */

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "brand" | "gold";

const badgeTone: Record<BadgeTone, string> = {
  neutral: "bg-[var(--ink-50)] text-[var(--ink-700)] border-[var(--ink-100)]",
  success: "bg-[var(--green-100)] text-[var(--green-800)] border-transparent",
  warning: "bg-[var(--gold-100)] text-[var(--gold-600)] border-transparent",
  danger: "bg-[var(--red-100)] text-[var(--red-700)] border-transparent",
  brand: "bg-[var(--terra-100)] text-[var(--terra-800)] border-transparent",
  gold: "bg-[var(--gold-500)] text-[var(--ink-900)] border-transparent",
};

export function Badge({
  children, tone = "neutral", icon,
}: { children: React.ReactNode; tone?: BadgeTone; icon?: React.ReactNode }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full " +
        "text-[11px] font-semibold tracking-wide border " +
        badgeTone[tone]
      }
    >
      {icon}
      {children}
    </span>
  );
}

/* ---------------------------------- Input ----------------------------------- */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export function Input({
  label, hint, error, leading, trailing, className = "", id, ...rest
}: InputProps) {
  const inputId = id ?? React.useId();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId}
          className="text-[13px] font-medium text-[var(--ink-700)]">
          {label}
        </label>
      )}
      <div
        className={
          "flex items-center gap-2 h-11 px-3.5 rounded-[var(--r-md)] bg-white " +
          "border transition-colors " +
          (error
            ? "border-[var(--red-600)] focus-within:border-[var(--red-700)] "
            : "border-[var(--ink-200)] focus-within:border-[var(--terra-500)] ")
        }
      >
        {leading && <span className="text-[var(--ink-400)] shrink-0">{leading}</span>}
        <input
          id={inputId}
          className={"flex-1 bg-transparent outline-none text-[14px] placeholder:text-[var(--ink-300)] " + className}
          {...rest}
        />
        {trailing && <span className="text-[var(--ink-400)] shrink-0">{trailing}</span>}
      </div>
      {error ? (
        <span className="text-[12px] text-[var(--red-600)]">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-[var(--ink-400)]">{hint}</span>
      ) : null}
    </div>
  );
}

export function Textarea({
  label, hint, error, id, className = "", ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string; hint?: string; error?: string;
}) {
  const inputId = id ?? React.useId();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-[var(--ink-700)]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={
          "w-full min-h-[110px] p-3.5 rounded-[var(--r-md)] bg-white text-[14px] resize-y " +
          "border outline-none transition-colors placeholder:text-[var(--ink-300)] " +
          (error
            ? "border-[var(--red-600)] focus:border-[var(--red-700)] "
            : "border-[var(--ink-200)] focus:border-[var(--terra-500)] ") +
          className
        }
        {...rest}
      />
      {error ? (
        <span className="text-[12px] text-[var(--red-600)]">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-[var(--ink-400)]">{hint}</span>
      ) : null}
    </div>
  );
}

/* -------------------------------- Skeleton ---------------------------------- */

export function Skeleton({ className = "", rounded = "var(--r-md)" }: { className?: string; rounded?: string }) {
  return (
    <div
      className={"relative overflow-hidden bg-[var(--ink-100)] " + className}
      style={{
        borderRadius: rounded,
        backgroundImage:
          "linear-gradient(90deg, var(--ink-100) 0%, var(--ink-50) 50%, var(--ink-100) 100%)",
        backgroundSize: "200% 100%",
        animation: "vm-shimmer 1.4s ease-in-out infinite",
      }}
    />
  );
}

/* ---------------------------------- Chip ------------------------------------ */

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  as?: "button" | "span";
  to?: string;
}

export function Chip({ children, active, onClick, as = "button", to }: ChipProps) {
  const cls =
    "inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium " +
    "border transition-all duration-150 whitespace-nowrap " +
    (active
      ? "bg-[var(--ink-900)] text-[var(--cream-50)] border-[var(--ink-900)] shadow-[var(--shadow-xs)] "
      : "bg-white text-[var(--ink-700)] border-[var(--ink-200)] hover:border-[var(--ink-400)] hover:bg-[var(--cream-50)] ");

  if (as === "span" && to) {
    return <Link to={to} className={cls}>{children}</Link>;
  }
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/* ---------------------------------- Divider --------------------------------- */

export function Divider({ className = "" }: { className?: string }) {
  return <div className={"h-px w-full bg-[var(--ink-100)] " + className} />;
}

/* ------------------------------ QuantityControl ----------------------------- */

export function QuantityControl({
  value, onChange, min = 1, max = 99,
}: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="inline-flex items-center h-10 rounded-full border border-[var(--ink-200)] bg-white overflow-hidden">
      <button
        type="button"
        aria-label="Diminuer"
        className="w-10 h-10 grid place-items-center hover:bg-[var(--ink-50)] disabled:opacity-30"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/></svg>
      </button>
      <span className="w-8 text-center text-[14px] font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Augmenter"
        className="w-10 h-10 grid place-items-center hover:bg-[var(--ink-50)] disabled:opacity-30"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  );
}

/* --------------------------------- Icons ------------------------------------ */

export const Icon = {
  Search: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  Cart: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>
    </svg>
  ),
  Home: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10h14V10"/>
    </svg>
  ),
  Store: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h16l-1 11H5L4 9Z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>
    </svg>
  ),
  Sparkle: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
      <circle cx="12" cy="12" r="3.2"/>
    </svg>
  ),
  User: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
    </svg>
  ),
  ChevronRight: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6"/>
    </svg>
  ),
  ChevronLeft: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 6-6 6 6 6"/>
    </svg>
  ),
  Close: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6 6 18"/>
    </svg>
  ),
  Check: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 13 4 4L19 7"/>
    </svg>
  ),
  Shield: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 4.5 3.2 7.7 8 9 4.8-1.3 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  Truck: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>
    </svg>
  ),
  Package: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 4.5v9L12 21 3 16.5v-9L12 3Z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>
    </svg>
  ),
  MapPin: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6"/>
    </svg>
  ),
  Plus: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
  ),
  Minus: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/></svg>
  ),
  Trash: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>
    </svg>
  ),
};
