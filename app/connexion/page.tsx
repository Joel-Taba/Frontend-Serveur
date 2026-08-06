import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import "../auth.css";

export const metadata: Metadata = {
  title: "Connexion — Flores Gong Nota",
};

export const dynamic = "force-dynamic";

export default function ConnexionPage() {
  return (
    <AuthShell
      title="Bon"
      accentWord="retour !"
      subtitle="Connectez-vous pour accéder à votre bibliothèque, vos favoris et votre progression."
    >
      <LoginForm />
    </AuthShell>
  );
}
