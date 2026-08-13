import type { Metadata } from "next";
import ProfileGuard from "@/components/profile/ProfileGuard";
import ProfilePage from "@/components/profile/ProfilePage";
import "../profile.css";

export const metadata: Metadata = {
  title: "Mon profil — Flores Gong Nota",
};

export const dynamic = "force-dynamic";

export default function Profil() {
  return (
    <ProfileGuard>
      <ProfilePage />
    </ProfileGuard>
  );
}
