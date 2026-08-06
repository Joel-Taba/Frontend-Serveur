const FEATURES = [
  {
    title: "Large choix de formats",
    description:
      "PDF, EPUB, images et JSON cohabitent dans une bibliothèque unique, organisée par niveau et facile à parcourir.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="7" height="16" rx="1.5" />
        <rect x="14" y="4" width="7" height="10" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Lecteur intégré",
    description:
      "Chaque type de document bénéficie d'une présentation de lecture adaptée, pensée pour le confort visuel.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 6c-2-1.5-5-2-8-1v13c3-1 6-.5 8 1 2-1.5 5-2 8-1V5c-3-1-6-.5-8 1z" />
      </svg>
    ),
  },
  {
    title: "Aucun téléchargement",
    description:
      "Les fichiers ne sont jamais exposés directement : uniquement diffusés à travers le lecteur, pour éviter toute copie.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="fonctionnalites" className="section section-tight">
      <p className="eyebrow">Ce que nous offrons</p>
      <h2>Une bibliothèque complète</h2>
      <div className="features-grid">
        {FEATURES.map((feature) => (
          <div className="feature-card" key={feature.title}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
