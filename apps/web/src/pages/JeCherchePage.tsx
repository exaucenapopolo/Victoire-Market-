import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Card, Icon, Input, Textarea } from "@/components/ui";
import { searchRequestSchema } from "@victoire/validation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

export function JeCherchePage() {
  const [productWanted, setProductWanted] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [maxBudget, setMaxBudget] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = searchRequestSchema.safeParse({
      productWanted,
      quantity,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      notes: notes || undefined,
      contactPhone: phone || undefined,
    });
    if (!parsed.success) {
      toast.push("Vérifie les champs du formulaire", "error");
      return;
    }
    setLoading(true);
    try {
      await api.createSearchRequest(parsed.data);
      setDone(true);
      toast.push("Demande enregistrée", "success");
    } catch (e) {
      toast.push(e instanceof Error ? e.message : "Erreur", "error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="container pt-10 md:pt-20 max-w-[560px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto grid place-items-center rounded-full bg-[var(--green-100)] text-[var(--green-800)]">
            <Icon.Check size={30} />
          </div>
          <h1 className="mt-5">Demande reçue</h1>
          <p className="mt-3 text-[14.5px] text-[var(--ink-500)]">
            L'équipe Victoire va chercher <span className="font-medium text-[var(--ink-900)]">{productWanted}</span> auprès
            de ses commerçants et partenaires. Tu recevras une proposition exploitable.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => { setDone(false); setProductWanted(""); setNotes(""); setMaxBudget(""); setPhone(""); }}>
              Nouvelle recherche
            </Button>
            <Button onClick={() => nav("/recherche")}>Explorer le marché</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container pt-6 md:pt-10 grid lg:grid-cols-[1.2fr_1fr] gap-8 max-w-[1000px]">
      <div>
        <p className="eyebrow">Fonction signature</p>
        <h1 className="mt-2">Je cherche</h1>
        <p className="mt-3 text-[15px] text-[var(--ink-500)] max-w-[520px] leading-relaxed">
          Le catalogue ne contient que ce que nos vendeurs publient. Si un produit n'y est pas,
          Victoire le cherche pour toi auprès de commerçants et partenaires locaux.
        </p>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-6"
        >
          <Card padded className="flex flex-col gap-4">
            <Input
              label="Produit recherché"
              placeholder="Ex. Pièce de rechange moto Yamaha"
              value={productWanted}
              onChange={(e) => setProductWanted(e.target.value)}
              required
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Quantité"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
              <Input
                label="Budget maximum (FCFA)"
                type="number"
                placeholder="Optionnel"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </div>
            <Input
              label="Téléphone (optionnel)"
              placeholder="Pour te recontacter"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Textarea
              label="Précisions"
              placeholder="Couleur, taille, marque, délai souhaité…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              Lancer la recherche
            </Button>
            <p className="text-[11.5px] text-[var(--ink-400)] text-center">
              Aucun engagement. Tu reçois une proposition, tu décides.
            </p>
          </Card>
        </motion.form>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--topbar-h)+20px)]">
          <Card padded className="bg-[var(--cream-50)] border-dashed">
            <p className="eyebrow">Comment ça marche</p>
            <ol className="mt-4 flex flex-col gap-4">
              <Step n={1} title="Tu décris" text="Dis-nous le produit, la quantité et ton budget." />
              <Step n={2} title="On cherche" text="L'équipe Victoire interroge commerçants et partenaires locaux." />
              <Step n={3} title="Tu reçois une offre" text="Prix, disponibilité, délai. Tu choisis ou tu passes." />
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-[var(--ink-900)] text-[var(--cream-50)] text-[12px] font-semibold"
        style={{ fontFamily: "var(--font-display)" }}>
        {n}
      </span>
      <div>
        <p className="text-[13.5px] font-medium">{title}</p>
        <p className="text-[12.5px] text-[var(--ink-500)] mt-0.5">{text}</p>
      </div>
    </li>
  );
}
