import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Card, Icon, Input } from "@/components/ui";
import { useAuth } from "@/store/auth";
import { useToast } from "@/components/ui/Toast";
import { Logo } from "@/components/layout/Logo";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const signIn = useAuth((s) => s.signIn);
  const nav = useNavigate();
  const toast = useToast();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      signIn({
        id: "u_demo",
        email,
        name: email.split("@")[0],
        role: "CUSTOMER",
      });
      toast.push("Bienvenue !", "success");
      setLoading(false);
      nav("/compte");
    }, 500);
  }

  return (
    <div className="container pt-8 md:pt-16 max-w-[440px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex justify-center mb-8"><Logo /></div>
        <Card padded className="!p-6 md:!p-8">
          <p className="eyebrow">Connexion</p>
          <h1 className="!text-[24px] mt-2">Ravi de te revoir</h1>
          <p className="mt-2 text-[13.5px] text-[var(--ink-500)]">
            Ton compte te permet de suivre tes commandes. La navigation reste libre.
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <Input
              label="Adresse e-mail"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
            />
            <Input
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              Se connecter
            </Button>
          </form>

          <p className="mt-5 text-center text-[13px] text-[var(--ink-500)]">
            Pas encore de compte ?{" "}
            <Link to="/inscription" className="text-[var(--terra-700)] font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </Card>

        <p className="mt-6 text-center text-[12.5px] text-[var(--ink-400)] inline-flex items-center justify-center gap-1.5 w-full">
          <Icon.Shield size={13} /> Connexion sécurisée Victoire
        </p>
      </motion.div>
    </div>
  );
}
