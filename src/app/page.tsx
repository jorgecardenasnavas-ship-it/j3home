import { Navbar } from "@/components/Navbar";
import { StickyClaim } from "@/components/StickyClaim";
import { HeroSection } from "@/components/HeroSection";
import { SponsorsBanner } from "@/components/SponsorsBanner";
import { CoachFinder } from "@/components/CoachFinder";
import { ProductsGrid } from "@/components/ProductsGrid";
import { FooterClose } from "@/components/FooterClose";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <StickyClaim />
      <main>
        <HeroSection />
        <SponsorsBanner />
        <CoachFinder />
        <ProductsGrid />
        <FooterClose />
      </main>
      <Footer />
    </>
  );
}
