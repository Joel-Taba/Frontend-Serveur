"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { LogInIcon } from "./adminIcons";

interface LoginEvent {
  id: number;
  user: number | null;
  user_email: string | null;
  email_attempted: string;
  success: boolean;
  ip_address: string | null;
  created_at: string;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

interface Paginated<T> {
  count: number;
  results: T[];
}

export default function LoginEventsPanel() {
  const [events, setEvents] = useState<LoginEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Paginated<LoginEvent>>("/accounts/login-events/")
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
  }, []);

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Historique des connexions</h2>
        <p>Chaque tentative de connexion à la plateforme, réussie ou non.</p>
      </div>

      {error && <p className="admin-message admin-message-error">{error}</p>}
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
    </div>
  );
}
