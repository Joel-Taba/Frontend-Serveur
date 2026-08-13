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
    <AuthShell variant="signup">
      <SignupForm />
    </AuthShell>
  );
}
