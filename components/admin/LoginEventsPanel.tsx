"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { LogInIcon } from "./adminIcons";
import ConfirmDialog from "./ConfirmDialog";

interface LoginEvent {
  id: number;
  user: number | null;
  user_email: string | null;
  email_attempted: string;
  success: boolean;
  ip_address: string | null;
  created_at: string;
}

interface Paginated<T> {
  count: number;
  results: T[];
}

type Period = "all" | "day" | "week" | "month" | "year";

const PERIODS: { id: Period; label: string; clearLabel: string }[] = [
  { id: "all", label: "Tout", clearLabel: "" },
  { id: "day", label: "Aujourd'hui", clearLabel: "de la journée" },
  { id: "week", label: "Cette semaine", clearLabel: "de la semaine" },
  { id: "month", label: "Ce mois", clearLabel: "du mois" },
  { id: "year", label: "Cette année", clearLabel: "de l'année" },
];

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

export default function LoginEventsPanel() {
  const [period, setPeriod] = useState<Period>("all");
  const [events, setEvents] = useState<LoginEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [clearing, setClearing] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Repasse en état "chargement" à chaque changement de période — sans
    // ça, changer de filtre laisserait affichée la liste (et l'erreur)
    // de la période précédente le temps que la nouvelle requête réponde.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvents(null);
    setError(null);
    const query = period === "all" ? "" : `?period=${period}`;
    apiFetch<Paginated<LoginEvent>>(`/accounts/login-events/${query}`)
      .then((data) => {
        if (!cancelled) setEvents(data.results);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Impossible de charger l'historique.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  async function confirmClear() {
    setConfirmingClear(false);
    setClearing(true);
    setMessage(null);
    try {
      const result = await apiFetch<{ deleted: number }>(`/accounts/login-events/clear/?period=${period}`, {
        method: "DELETE",
      });
      setEvents([]);
      setMessage({
        type: "success",
        text: `${result.deleted} connexion${result.deleted > 1 ? "s" : ""} supprimée${result.deleted > 1 ? "s" : ""}.`,
      });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Impossible de vider l'historique." });
    } finally {
      setClearing(false);
    }
  }

  const activePeriod = PERIODS.find((p) => p.id === period)!;

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Historique des connexions</h2>
        <p>Chaque tentative de connexion à la plateforme, réussie ou non.</p>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-tabs">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`admin-filter-tab${period === p.id ? " active" : ""}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {period !== "all" && (
          <button
            type="button"
            className="btn-danger"
            onClick={() => setConfirmingClear(true)}
            disabled={clearing || !events || events.length === 0}
          >
            {clearing ? "Suppression…" : `Vider l'historique ${activePeriod.clearLabel}`}
          </button>
        )}
      </div>

      {error && <p className="admin-message admin-message-error">{error}</p>}
      {message && <p className={`admin-message admin-message-${message.type}`}>{message.text}</p>}
      {!error && !events && <div className="admin-guard-status">Chargement…</div>}

      {events &&
        (events.length > 0 ? (
          <div className="admin-table">
            <div className="admin-table-head admin-table-head-4">
              <span>Compte</span>
              <span>Statut</span>
              <span>Adresse IP</span>
              <span>Connexion</span>
            </div>
            {events.map((event) => (
              <div key={event.id} className="admin-table-row admin-table-row-4 admin-table-row-static">
                <span className="admin-table-name">
                  <span className="admin-table-icon">
                    <LogInIcon />
                  </span>
                  {event.user_email ?? event.email_attempted}
                </span>
                <span>
                  <span className={`admin-badge${event.success ? "" : " admin-badge-danger"}`}>
                    {event.success ? "Réussie" : "Échouée"}
                  </span>
                </span>
                <span className="admin-table-muted">{event.ip_address ?? "—"}</span>
                <span className="admin-table-muted">{formatDateTime(event.created_at)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Aucune connexion pour l&apos;instant.</p>
        ))}

      {confirmingClear && (
        <ConfirmDialog
          title="Vider l'historique ?"
          message={`Toutes les connexions ${activePeriod.clearLabel} seront définitivement supprimées. Cette action est irréversible.`}
          confirmLabel="Vider"
          onConfirm={confirmClear}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </div>
  );
}
