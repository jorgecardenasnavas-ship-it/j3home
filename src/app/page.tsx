import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SponsorsBanner } from "@/components/SponsorsBanner";
import { ImpactSection } from "@/components/ImpactSection";
import { SystemReveal } from "@/components/SystemReveal";
import { ProductsSection } from "@/components/ProductsSection";
import { NosotrosSection } from "@/components/NosotrosSection";
import { HomeTextBlock } from "@/components/HomeTextBlock";
import { ContactoSection } from "@/components/ContactoSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SponsorsBanner />
        <ImpactSection />
        <SystemReveal />
        <HomeTextBlock />
        <ProductsSection />
        <NosotrosSection />

        <ContactoSection />
      </main>
      <Footer />
    </>
  );
}
