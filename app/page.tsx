import Hero from "@/components/Hero";
import AlphabetDivider from "@/components/AlphabetDivider";
import About from "@/components/About";
import ChatWidget from "@/components/chat/ChatWidget";
import Features from "@/components/Features";
import Marquee from "@/components/Marquee";
import CatalogueSearch from "@/components/CatalogueSearch";
import Catalogue from "@/components/Catalogue";
import Stats from "@/components/Stats";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { getCatalogTree, listAllDocuments } from "@/lib/catalog";
import { getEcosystemTools } from "@/lib/tools";
import { recordVisit, getRegisteredAccountCount } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function Home() {
  recordVisit("/");
  const [tree, searchIndex, tools, accountCount] = await Promise.all([
    getCatalogTree(),
    listAllDocuments(),
    getEcosystemTools(),
    getRegisteredAccountCount(),
  ]);
  const formatCount = new Set(searchIndex.map((doc) => doc.type)).size;

  return (
    <>
      <Hero />
      <AlphabetDivider />
      <main>
        <About documentCount={searchIndex.length} formatCount={formatCount} />
        <Features />
        <Marquee />
        <CatalogueSearch searchIndex={searchIndex} />
        <Catalogue tree={tree} tools={tools} />
        <Stats documentCount={searchIndex.length} accountCount={accountCount} />
        <Faq />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
