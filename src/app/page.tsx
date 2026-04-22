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
import { FloatingCTA } from "@/components/FloatingCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <StickyClaim />
      <main>
        <HeroSection />
        <SponsorsBanner />
        <CoachFinder />
        <HomeManifesto />
        <ProductsGrid />
        <StoryTeaser />
        <FooterClose />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
