"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import StatTile from "./StatTile";
import AreaLineChart from "./charts/AreaLineChart";
import BarChartCard from "./charts/BarChartCard";
import HorizontalBars from "./charts/HorizontalBars";
import { LibraryIcon, PulseIcon, TrendingUpIcon } from "./adminIcons";
import { FolderIcon as CategoryIcon } from "../catalogueIcons";

interface BackendDashboard {
  document_count: number;
  folder_count: number;
  today_visits: number;
  total_visits: number;
  visits: { date: string; count: number }[];
  category_breakdown: { label: string; value: number }[];
  format_breakdown: { label: string; value: number }[];
}

const FORMAT_LABELS: Record<string, string> = { pdf: "PDF", epub: "EPUB", image: "Images", json: "JSON" };
const FORMAT_COLORS: Record<string, string> = {
  pdf: "var(--accent-pdf)",
  epub: "var(--accent-epub)",
  image: "var(--accent-image)",
  json: "var(--accent-json)",
};

export default function DashboardOverview() {
  const [data, setData] = useState<BackendDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<BackendDashboard>("/analytics/dashboard/")
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Impossible de charger le tableau de bord.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="admin-message admin-message-error">{error}</p>;
  if (!data) return <div className="admin-guard-status">Chargement du tableau de bord…</div>;

  const formatBreakdown = data.format_breakdown.map((entry) => ({
    label: FORMAT_LABELS[entry.label] ?? entry.label,
    value: entry.value,
    color: FORMAT_COLORS[entry.label] ?? "var(--accent)",
  }));

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Vue d&apos;ensemble</h2>
        <p>Les paramètres clés de la bibliothèque, mis à jour en direct.</p>
      </div>

      <div className="admin-stat-grid">
        <StatTile icon={<LibraryIcon />} label="Documents dans la bibliothèque" value={data.document_count} />
        <StatTile icon={<CategoryIcon />} label="Catégories" value={data.folder_count} />
        <StatTile icon={<PulseIcon />} label="Visites aujourd'hui" value={data.today_visits} />
        <StatTile icon={<TrendingUpIcon />} label="Visites au total" value={data.total_visits} />
      </div>

      <div className="admin-chart-grid">
        <div className="admin-chart-card admin-chart-card-wide">
          <div className="admin-chart-card-header">
            <h3>Évolution des visites</h3>
            <span className="admin-chart-card-sub">14 derniers jours</span>
          </div>
          <AreaLineChart data={data.visits.map((d) => ({ label: d.date, value: d.count }))} />
        </div>

        <div className="admin-chart-card">
          <div className="admin-chart-card-header">
            <h3>Répartition par format</h3>
          </div>
          <HorizontalBars data={formatBreakdown} />
        </div>

        <div className="admin-chart-card admin-chart-card-wide">
          <div className="admin-chart-card-header">
            <h3>Documents par catégorie</h3>
          </div>
          <BarChartCard data={data.category_breakdown} />
        </div>
      </div>
    </div>
  );
}
