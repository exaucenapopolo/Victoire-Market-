import { motion } from "framer-motion";

export function EmptyState({
  title, description, action, icon,
}: { title: string; description?: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center py-16 px-6"
    >
      <div className="w-16 h-16 grid place-items-center rounded-[20px] bg-[var(--cream-200)] text-[var(--terra-700)] mb-4">
        {icon ?? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
        )}
      </div>
      <h3 className="text-[18px] font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 text-[14px] text-[var(--ink-400)] max-w-[380px]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
