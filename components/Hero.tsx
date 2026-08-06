import Image from "next/image";
import Header from "./Header";
import HeroSearchForm from "./HeroSearchForm";
import type { SearchableDocument } from "@/lib/catalog";

export default function Hero({ searchIndex }: { searchIndex: SearchableDocument[] }) {
  return (
    <section className="hero-photo">
      <div className="hero-photo-media">
        <Image
          src="/assets/covers/background.jpg"
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "62% 50%" }}
        />
        <div className="hero-photo-scrim" />
      </div>

      <Header />

      <span className="hero-photo-wordmark" aria-hidden="true">
        Flores Gong Nota
      </span>

      <div className="hero-photo-inner">
        <h1>Découvrez Une Sélection Choisie De Livres &amp; Documents</h1>
        <p className="hero-photo-subtitle">
          Science, romance, développement personnel, astronomie, histoire… Une collection que
          vous parcourez et lisez entièrement en ligne grâce à notre lecteur intégré — sans
          jamais télécharger ni copier les fichiers.
        </p>
        <div className="hero-photo-search-wrap">
          <HeroSearchForm searchIndex={searchIndex} />
        </div>
      </div>
    </section>
  );
}
