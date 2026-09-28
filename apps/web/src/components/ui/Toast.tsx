import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./index";

interface ToastItem {
  id: string;
  message: string;
  tone: "success" | "error" | "info";
}

interface ToastContext {
  push: (message: string, tone?: ToastItem["tone"]) => void;
}

const Ctx = React.createContext<ToastContext | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((message: string, tone: ToastItem["tone"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setItems((s) => [...s, { id, message, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3600);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(var(--bottomnav-h)+var(--safe-bottom)+12px)] md:bottom-6 z-50 flex flex-col gap-2 pointer-events-none w-[min(92vw,420px)]">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={
                "pointer-events-auto rounded-[var(--r-md)] px-4 py-3 shadow-[var(--shadow-lg)] " +
                "flex items-center gap-3 border " +
                (t.tone === "success"
                  ? "bg-[var(--ink-900)] text-white border-[var(--ink-800)] "
                  : t.tone === "error"
                    ? "bg-[var(--red-600)] text-white border-[var(--red-700)] "
                    : "bg-white text-[var(--ink-900)] border-[var(--ink-100)] ")
              }
            >
              {t.tone === "success" && <Icon.Check />}
              <span className="text-[14px] font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastContext {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useToast doit être utilisé dans ToastProvider");
  return v;
}
