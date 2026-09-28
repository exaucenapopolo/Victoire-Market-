import { motion } from "framer-motion";
import { Navigate, Link } from "react-router-dom";
import { Card, Divider, Icon, LinkButton, Button } from "@/components/ui";
import { useAuth } from "@/store/auth";
import { initialsFor } from "@/lib/gradient";
import { formatFCFA } from "@/lib/format";

export function AccountPage() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);

  if (!user) return <Navigate to="/connexion" replace />;

  return (
    <div className="container pt-6 md:pt-10 max-w-[720px]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card padded className="flex items-center gap-4">
          <span className="w-14 h-14 grid place-items-center rounded-[16px] bg-[var(--ink-900)] text-[var(--terra-400)] text-[18px] font-semibold"
            style={{ fontFamily: "var(--font-display)" }}>
            {initialsFor(user.name ?? user.email)}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-medium truncate">{user.name ?? "Mon compte"}</p>
            <p className="text-[13px] text-[var(--ink-400)] truncate">{user.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>Se déconnecter</Button>
        </Card>
      </motion.div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <AccountTile to="/je-cherche" icon={<Icon.Sparkle size={18} />} title="Mes recherches" subtitle="Demandes Je cherche" />
        <AccountTile to="/panier" icon={<Icon.Cart size={18} />} title="Mon panier" subtitle="Articles en attente" />
      </div>

      <Card padded className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="!text-[15px]">Commandes récentes</h3>
          <span className="text-[12px] text-[var(--ink-400)]">—</span>
        </div>
        <Divider className="my-4" />
        <div className="flex flex-col gap-3">
          <FakeOrder ref="VIC-20260112-A2C4" date="12 janv. 2026" total={24_743} status="Livré" />
          <FakeOrder ref="VIC-20260105-K9F1" date="05 janv. 2026" total={13_238} status="Retiré" />
        </div>
      </Card>

      <div className="mt-6">
        <LinkButton to="/recherche" variant="outline" className="w-full">
          Continuer à explorer le marché
        </LinkButton>
      </div>
    </div>
  );
}

function AccountTile({ to, icon, title, subtitle }: { to: string; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <Link to={to}>
      <Card interactive className="flex items-center gap-3 !p-4">
        <span className="w-10 h-10 grid place-items-center rounded-[12px] bg-[var(--terra-100)] text-[var(--terra-700)]">
          {icon}
        </span>
        <div className="flex-1">
          <p className="font-medium text-[14px]">{title}</p>
          <p className="text-[12px] text-[var(--ink-400)]">{subtitle}</p>
        </div>
        <Icon.ChevronRight size={16} />
      </Card>
    </Link>
  );
}

function FakeOrder({ ref, date, total, status }: { ref: string; date: string; total: number; status: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium mono">{ref}</p>
        <p className="text-[12px] text-[var(--ink-400)]">{date}</p>
      </div>
      <div className="text-right">
        <p className="text-[13.5px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          {formatFCFA(total)}
        </p>
        <p className="text-[12px] text-[var(--green-600)]">{status}</p>
      </div>
    </div>
  );
}
