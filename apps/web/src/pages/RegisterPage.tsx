import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Card, Icon, Input } from "@/components/ui";
import { useAuth } from "@/store/auth";
import { useToast } from "@/components/ui/Toast";
import { Logo } from "@/components/layout/Logo";
import { customerSignupSchema } from "@victoire/validation";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const signIn = useAuth((s) => s.signIn);
  const nav = useNavigate();
  const toast = useToast();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = customerSignupSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (path === "email" || path === "password") errs[path] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      signIn({
        id: "u_demo",
        email: parsed.data.email,
        name: parsed.data.email.split("@")[0],
        role: "CUSTOMER",
      });
      toast.push("Compte créé", "success");
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
          <p className="eyebrow">Inscription courte</p>
          <h1 className="!text-[24px] mt-2">Créer un compte</h1>
          <p className="mt-2 text-[13.5px] text-[var(--ink-500)]">
            Deux champs suffisent. Le reste se demandera au moment utile.
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
              error={errors.email}
            />
            <Input
              label="Mot de passe"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              hint="Nous ne demandons ni ville, ni adresse, ni date de naissance."
              error={errors.password}
            />
            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              Créer mon compte
            </Button>
          </form>

          <p className="mt-5 text-center text-[13px] text-[var(--ink-500)]">
            Déjà inscrit ?{" "}
            <Link to="/connexion" className="text-[var(--terra-700)] font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </Card>

        <p className="mt-6 text-center text-[12.5px] text-[var(--ink-400)] inline-flex items-center justify-center gap-1.5 w-full">
          <Icon.Shield size={13} /> Données minimales, stockées en sécurité
        </p>
      </motion.div>
    </div>
  );
}
