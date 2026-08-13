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
    <AuthShell variant="login">
      <LoginForm />
    </AuthShell>
  );
}
