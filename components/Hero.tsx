"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "./Header";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const COVERS_BASE_PATH = "/assets/covers/";
// Une diapositive = une ou deux photos (la 3e affiche deux images côte à
// côte) ; le texte associé vient de t.hero.slides (même ordre, i18n).
const SLIDE_IMAGES: string[][] = [["Accueil4.jpg"], ["Accueil1.jpg"], ["Accueil2.jpg", "Accueil3.jpg"]];
const SLIDE_DURATION_MS = 6500;
const FACE_COUNT = SLIDE_IMAGES.length;
const FACE_ANGLE = 360 / FACE_COUNT;

export default function Hero() {
  const { t } = useLanguage();
  // Le cube tourne toujours dans le même sens : rotationStep ne fait
  // qu'augmenter (jamais remis à 0), pour que la rotation ne reparte
  // jamais en arrière à la fin d'un cycle — seul son reste modulo
  // FACE_COUNT détermine la diapositive affichée.
  const [rotationStep, setRotationStep] = useState(0);
  const [faceDepth, setFaceDepth] = useState(0);
  const cubeRef = useRef<HTMLDivElement>(null);
  const activeSlide = ((rotationStep % FACE_COUNT) + FACE_COUNT) % FACE_COUNT;
  // Vidéo pas encore fournie (voir t.hero.demoMessage) : le bouton ouvre
  // déjà la boîte de dialogue, prête à recevoir un <video>/<iframe> le jour
  // où la vidéo arrive, plutôt qu'un bouton mort en attendant.
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    if (!isDemoOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsDemoOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDemoOpen]);

  // Avance automatiquement ; un clic sur un point relance le minuteur à
  // partir de ce moment-là plutôt que de couper court au décompte en cours.
  useEffect(() => {
    const timer = setInterval(() => {
      setRotationStep((current) => current + 1);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [rotationStep]);

  // Va vers une diapositive précise en avançant toujours vers l'avant —
  // jamais en reculant, même si la diapo visée est "derrière" dans le cycle.
  function goToSlide(targetIndex: number) {
    if (targetIndex === activeSlide) return;
    setRotationStep((current) => {
      let diff = targetIndex - activeSlide;
      if (diff <= 0) diff += FACE_COUNT;
      return current + diff;
    });
  }

  // Profondeur des faces du cube : dépend de la largeur réelle du bandeau
  // (recalculée au redimensionnement) — géométrie d'un prisme régulier à
  // FACE_COUNT faces, chaque face plaquée à cette distance de l'axe pour
  // former un volume cohérent plutôt que des images qui s'entrecroisent.
  useEffect(() => {
    function updateDepth() {
      if (cubeRef.current) {
        const width = cubeRef.current.offsetWidth;
        setFaceDepth(width / (2 * Math.tan(Math.PI / FACE_COUNT)));
      }
    }
    updateDepth();
    window.addEventListener("resize", updateDepth);
    return () => window.removeEventListener("resize", updateDepth);
  }, []);

  const slide = t.hero.slides[activeSlide];

  return (
    <section className="hero-photo">
      <div className="hero-cube-stage">
        <div className="hero-cube" ref={cubeRef} style={{ transform: `rotateY(${-rotationStep * FACE_ANGLE}deg)` }}>
          {SLIDE_IMAGES.map((images, index) => (
            <div
              key={images.join("+")}
              className="hero-cube-face"
              style={{ transform: `rotateY(${index * FACE_ANGLE}deg) translateZ(${faceDepth}px)` }}
              aria-hidden={index !== activeSlide}
            >
              {images.map((file) => (
                <div key={file} className="hero-slide-image-wrap">
                  <Image
                    src={`${COVERS_BASE_PATH}${file}`}
                    alt=""
                    fill
                    priority={index === 0}
                    quality={95}
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="hero-photo-textscrim" aria-hidden="true" />
      </div>

      <Header />

      <span className="hero-photo-wordmark" aria-hidden="true">
        Flores Gong Nota
      </span>

      <div className="hero-photo-inner">
        <div key={activeSlide} className="hero-slide-text">
          <h1>{slide.heading}</h1>
          <p className="hero-photo-subtitle">{slide.subheading}</p>
        </div>
        <button type="button" className="btn btn-primary hero-demo-cta" onClick={() => setIsDemoOpen(true)}>
          <PlayIcon />
          {t.hero.demoCta}
        </button>
        <div className="hero-slide-dots" role="tablist" aria-label={t.hero.slideLabel}>
          {SLIDE_IMAGES.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === activeSlide}
              aria-label={`${t.hero.slideLabel} ${index + 1}`}
              className={`hero-slide-dot${index === activeSlide ? " active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {isDemoOpen && (
        <div className="confirm-overlay" onClick={() => setIsDemoOpen(false)}>
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-demo-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="hero-demo-title">{t.hero.demoTitle}</h3>
            <p>{t.hero.demoMessage}</p>
            <button type="button" className="btn btn-primary" onClick={() => setIsDemoOpen(false)}>
              {t.hero.demoClose}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);
