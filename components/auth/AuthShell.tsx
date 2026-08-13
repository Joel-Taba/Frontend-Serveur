"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { OrbitIcon, BackArrowIcon } from "./authIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AuthShell({
  variant,
  children,
}: {
  variant: "login" | "signup";
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const title = variant === "login" ? t.auth.loginTitle : t.auth.signupTitle;
  const accentWord = variant === "login" ? t.auth.loginAccent : t.auth.signupAccent;
  const subtitle = variant === "login" ? t.auth.loginSubtitle : t.auth.signupSubtitle;

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <Image
          src="/assets/covers/fond.jpg"
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "62% 50%" }}
        />
        <div className="auth-scrim" />
      </div>

      <Link className="auth-back-link" href="/">
        <BackArrowIcon />
        <span>{t.auth.backToSite}</span>
      </Link>

      <div className="auth-card">
        <span className="auth-icon">
          <OrbitIcon />
        </span>
        <h1>
          {title} <span>{accentWord}</span>
        </h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
