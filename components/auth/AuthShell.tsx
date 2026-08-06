import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { OrbitIcon, BackArrowIcon } from "./authIcons";

export default function AuthShell({
  title,
  accentWord,
  subtitle,
  children,
}: {
  title: string;
  accentWord: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="auth-page">
      <div className="auth-bg">
        <Image
          src="/assets/covers/background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "62% 50%" }}
        />
        <div className="auth-scrim" />
      </div>

      <Link className="auth-back-link" href="/">
        <BackArrowIcon />
        <span>Retour au site</span>
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
