import { Navbar } from "@/components/Navbar";
import { StickyClaim } from "@/components/StickyClaim";
import { HeroSection } from "@/components/HeroSection";
import { SponsorsBanner } from "@/components/SponsorsBanner";
import { CoachFinder } from "@/components/CoachFinder";
import { HomeManifesto } from "@/components/HomeManifesto";
import { ProductsGrid } from "@/components/ProductsGrid";
import { StoryTeaser } from "@/components/StoryTeaser";
import { FooterClose } from "@/components/FooterClose";
import { Footer } from "@/components/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <StickyClaim />
      <main className="bg-[var(--wh)]">
        <HeroSection />
        <CoachFinder />
        <SponsorsBanner />
        <HomeManifesto />
        <ProductsGrid />
        <StoryTeaser />
        <FooterClose />
      </main>
      <Footer />
    </>
  );
}
