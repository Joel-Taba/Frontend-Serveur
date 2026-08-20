"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { authHeaders } from "@/lib/api";
import { ChatBubbleIcon, CloseIcon } from "./chatIcons";
import { SendIcon } from "@/components/catalogueIcons";

// URL du micro-service assistant (voir IA/PLAN_ASSISTANT_IA.md), séparé du
// Backend Django — pas encore déployée : tant que cette variable n'est pas
// renseignée, le widget reste utilisable (l'interface est prête) mais
// répond directement que l'assistant arrive bientôt, sans tenter d'appel
// réseau voué à échouer.
const ASSISTANT_API_URL = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface AssistantResponse {
  trouve: boolean;
  reponse: string;
}

export default function ChatWidget() {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isSending]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const question = input.trim();
    // Le bouton d'envoi est désactivé sans compte connecté (voir le rendu
    // ci-dessous), mais on revérifie ici : la restriction doit tenir même
    // si l'état d'authentification change pendant que le formulaire est
    // affiché (session expirée entre-temps, par exemple).
    if (!question || isSending || !user) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setIsSending(true);

    if (!ASSISTANT_API_URL) {
      setMessages((prev) => [...prev, { role: "assistant", text: t.chat.unavailable }]);
      setIsSending(false);
      return;
    }

    try {
      const res = await fetch(ASSISTANT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ question }),
      });
      // 401 : jeton absent/expiré — le service assistant vérifie lui-même
      // l'authentification (voir IA/assistant_ia.py), on ne peut pas se
      // contenter de masquer le formulaire côté client.
      if (res.status === 401) {
        setMessages((prev) => [...prev, { role: "assistant", text: t.chat.loginRequired }]);
        return;
      }
      if (!res.ok) throw new Error("assistant-error");
      const data: AssistantResponse = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reponse }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: t.chat.error }]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="chat-widget" dir={dir}>
      {isOpen && (
        <div className="chat-widget-panel">
          <div className="chat-widget-header">
            <div>
              <p className="chat-widget-title">{t.chat.title}</p>
              <p className="chat-widget-subtitle">{t.chat.subtitle}</p>
            </div>
            <button
              type="button"
              className="chat-widget-close"
              onClick={() => setIsOpen(false)}
              aria-label={t.chat.closeLabel}
            >
              <CloseIcon />
            </button>
          </div>

          {!user ? (
            <div className="chat-widget-login-required">
              <p>{t.chat.loginRequired}</p>
              <Link className="btn btn-primary" href="/connexion" onClick={() => setIsOpen(false)}>
                {t.chat.loginCta}
              </Link>
            </div>
          ) : (
            <>
              <div className="chat-widget-messages">
                <div className="chat-bubble chat-bubble-assistant">{t.chat.greeting}</div>
                {messages.map((message, index) => (
                  <div key={index} className={`chat-bubble chat-bubble-${message.role}`}>
                    {message.text}
                  </div>
                ))}
                {isSending && (
                  <div className="chat-bubble chat-bubble-assistant chat-bubble-thinking">{t.chat.thinking}</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-widget-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t.chat.placeholder}
                  aria-label={t.chat.placeholder}
                />
                <button type="submit" disabled={!input.trim() || isSending} aria-label={t.chat.send}>
                  <SendIcon />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        className="chat-widget-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? t.chat.closeLabel : t.chat.openLabel}
      >
        {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
      </button>
    </div>
  );
}
