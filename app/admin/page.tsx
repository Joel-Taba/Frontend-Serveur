import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminGuard from "@/components/admin/AdminGuard";
import { getCatalogTree } from "@/lib/catalog";
import "../admin.css";

export const metadata: Metadata = {
  title: "Espace gestionnaire — Flores Gong Nota",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const tree = await getCatalogTree();

  return (
    <div className="admin-page">
      <AdminGuard>
        <AdminDashboard tree={tree} />
      </AdminGuard>
    </div>
  );
}
