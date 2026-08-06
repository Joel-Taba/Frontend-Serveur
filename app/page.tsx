import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Marquee from "@/components/Marquee";
import Catalogue from "@/components/Catalogue";
import Stats from "@/components/Stats";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import { getCatalogTree, listAllDocuments } from "@/lib/catalog";
import { getEcosystemTools } from "@/lib/tools";
import { recordVisit } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function Home() {
  recordVisit("/");
  const [tree, searchIndex, tools] = await Promise.all([getCatalogTree(), listAllDocuments(), getEcosystemTools()]);
  const formatCount = new Set(searchIndex.map((doc) => doc.type)).size;

  return (
    <>
      <Hero searchIndex={searchIndex} />
      <main>
        <About documentCount={searchIndex.length} formatCount={formatCount} />
        <Features />
        <Marquee />
        <Catalogue tree={tree} tools={tools} />
        <Stats documentCount={searchIndex.length} />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
