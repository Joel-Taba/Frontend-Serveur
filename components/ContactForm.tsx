"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { SendIcon, MailIcon } from "./catalogueIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const CONTACT_EMAIL = "joeltaba4@gmail.com";

export default function ContactForm() {
  const { t } = useLanguage();
  const [type, setType] = useState(t.contact.types[0].key);
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
        body: { name: name.trim(), message_type: type, message: message.trim() },
      });
      setMessage("");
      setName("");
      setStatus({ kind: "success", text: t.contact.success });
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof ApiError ? err.message : t.contact.error,
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
      <h3>{t.contact.heading}</h3>
      <p>{t.contact.subtitle}</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <select value={type} onChange={(event) => setType(event.target.value)} aria-label={t.contact.typeAriaLabel}>
            {t.contact.types.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder={t.contact.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <textarea
          placeholder={t.contact.messagePlaceholder}
          rows={4}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t.contact.sending : t.contact.send} <SendIcon />
        </button>
      </form>

      {status && <p className={`contact-status contact-status-${status.kind}`}>{status.text}</p>}

      <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
        {CONTACT_EMAIL}
      </a>
    </div>
  );
}
