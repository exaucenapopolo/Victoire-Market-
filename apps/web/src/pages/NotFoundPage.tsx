import { EmptyState } from "@/components/common/EmptyState";
import { LinkButton } from "@/components/ui";

export function NotFoundPage() {
  return (
    <div className="container pt-10 md:pt-20">
      <EmptyState
        title="Page introuvable"
        description="Le lien est peut-être cassé, ou la page a été déplacée."
        action={<LinkButton to="/">Retour à l'accueil</LinkButton>}
      />
    </div>
  );
}
