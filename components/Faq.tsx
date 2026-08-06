import ContactForm from "./ContactForm";
import { ChevronIcon } from "./catalogueIcons";

const FAQS = [
  {
    q: "Qu'est-ce que Flores Gong Nota ?",
    a: "Une bibliothèque numérique qui rassemble des cours et documents (PDF, EPUB, images, JSON), classés par niveau, consultables directement en ligne grâce à un lecteur intégré.",
  },
  {
    q: "Dois-je télécharger un document pour le lire ?",
    a: "Non. Chaque document s'ouvre dans notre lecteur intégré et reste en lecture seule : aucun téléchargement ni copie n'est proposé.",
  },
  {
    q: "Comment les documents sont-ils organisés ?",
    a: "Ils sont classés dans des dossiers par niveau (Primaire, Secondaire, Supérieur…). De nouveaux dossiers peuvent être ajoutés à tout moment et apparaissent automatiquement dans la Bibliothèque.",
  },
  {
    q: "Le catalogue est-il mis à jour régulièrement ?",
    a: "Oui : chaque nouveau document ajouté au serveur apparaît instantanément dans le catalogue, sans redémarrage ni intervention technique.",
  },
  {
    q: "Ai-je besoin d'un compte pour consulter la bibliothèque ?",
    a: "Pas pour l'instant : la lecture est ouverte à tous. La création de compte est en préparation et permettra bientôt de sauvegarder vos favoris et votre progression.",
  },
  {
    q: "Qu'est-ce que la section « Nos Outils » ?",
    a: "C'est l'espace où nous présentons les autres applications de notre écosystème, comme notre future appli d'apprentissage de l'alphabet, actuellement en développement.",
  },
  {
    q: "Puis-je utiliser le site depuis un téléphone ou une tablette ?",
    a: "Oui, l'interface s'adapte à toutes les tailles d'écran, y compris le lecteur de documents.",
  },
  {
    q: "L'accès à la bibliothèque est-il payant ?",
    a: "Non, l'accès est entièrement gratuit.",
  },
  {
    q: "Que faire si un document ne s'ouvre pas correctement ?",
    a: "Cela peut arriver avec de très gros fichiers le temps qu'ils se chargent. Si le problème persiste, écrivez-nous via l'espace de contact ci-contre.",
  },
  {
    q: "Comment vous signaler un problème ou une suggestion ?",
    a: "Grâce à l'espace de contact ci-contre : plaintes, encouragements, critiques ou suggestions, tous les messages sont lus.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="section">
      <p className="eyebrow">FAQ</p>
      <h2>Questions Fréquentes</h2>
      <div className="faq-layout">
        <div className="faq-list">
          {FAQS.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="faq-chevron">
                  <ChevronIcon />
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
