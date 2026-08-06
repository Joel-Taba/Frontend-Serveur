import { BookIcon, UsersIcon } from "./catalogueIcons";

// La création de compte n'est pas encore implémentée : ce compteur reflète
// le nombre réel de comptes (0 pour l'instant) et augmentera une fois la
// fonctionnalité en place.
const REGISTERED_ACCOUNTS = 0;

export default function Stats({ documentCount }: { documentCount: number }) {
  const stats = [
    { icon: <BookIcon />, value: documentCount, label: "Livres dans notre bibliothèque" },
    { icon: <UsersIcon />, value: REGISTERED_ACCOUNTS, label: "Comptes créés sur le site" },
  ];

  return (
    <section id="chiffres" className="section">
      <div className="stats-panel">
        <p className="eyebrow">Nos chiffres</p>
        <h2>Une Collection Qui Parle D&apos;Elle-Même</h2>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-block" key={stat.label}>
              <span className="stat-block-icon">{stat.icon}</span>
              <span className="stat-block-value">{stat.value}</span>
              <span className="stat-block-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
