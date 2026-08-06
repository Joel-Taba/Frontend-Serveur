import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";
import "../auth.css";

export const metadata: Metadata = {
  title: "Inscription — Flores Gong Nota",
};

export const dynamic = "force-dynamic";

export default function InscriptionPage() {
  return (
    <AuthShell
      title="Rejoignez-"
      accentWord="nous !"
      subtitle="Créez votre compte pour sauvegarder vos favoris et suivre votre progression de lecture."
    >
      <SignupForm />
    </AuthShell>
  );
}
