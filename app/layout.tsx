import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/AuthContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

// Polices auto-hébergées (fichiers dans assets/fonts/, extraits une fois
// des paquets @fontsource) plutôt que next/font/google : ce dernier
// télécharge les polices depuis fonts.googleapis.com au moment du build,
// une dépendance externe inutile — et bloquante — pour un serveur autonome
// qui doit pouvoir reconstruire le site hors ligne.
const inter = localFont({
  src: "../assets/fonts/inter-variable.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const cormorant = localFont({
  src: [
    { path: "../assets/fonts/cormorant-garamond-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flores Gong Nota — Bibliothèque numérique",
  description:
    "Une collection soignée de documents — PDF, images, EPUB, JSON — à consulter en ligne grâce à un lecteur intégré, sans téléchargement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
