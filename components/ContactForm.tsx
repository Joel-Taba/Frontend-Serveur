"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { SendIcon, MailIcon } from "./catalogueIcons";

const CONTACT_EMAIL = "joeltaba4@gmail.com";

const MESSAGE_TYPES = ["Appréciation", "Suggestion", "Critique", "Plainte", "Autre"];

const TYPE_TO_BACKEND: Record<string, string> = {
  Appréciation: "appreciation",
  Suggestion: "suggestion",
  Critique: "critique",
  Plainte: "plainte",
  Autre: "autre",
};

export default function ContactForm() {
  const [type, setType] = useState(MESSAGE_TYPES[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setStatus(null);
    try {
      await apiFetch("/contact/messages/", {
        method: "POST",
        auth: false,
        body: { name: name.trim(), message_type: TYPE_TO_BACKEND[type] ?? "autre", message: message.trim() },
      });
      setMessage("");
      setName("");
      setStatus({ kind: "success", text: "Message envoyé, merci !" });
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof ApiError ? err.message : "Impossible d'envoyer le message pour le moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-card">
      <span className="contact-card-icon">
        <MailIcon />
      </span>
      <h3>Une remarque à nous partager ?</h3>
      <p>Plainte, encouragement, critique ou appréciation — tous les messages sont lus.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Type de message">
            {MESSAGE_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Votre nom (optionnel)"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <textarea
          placeholder="Votre message…"
          rows={4}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Envoi…" : "Envoyer"} <SendIcon />
        </button>
      </form>

      {status && <p className={`contact-status contact-status-${status.kind}`}>{status.text}</p>}

      <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
    </div>
  );
}
