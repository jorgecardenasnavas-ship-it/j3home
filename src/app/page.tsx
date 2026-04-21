import { Navbar } from "@/components/Navbar";
import { StickyClaim } from "@/components/StickyClaim";
import { HeroSection } from "@/components/HeroSection";
import { CoachFinder } from "@/components/CoachFinder";
import { SponsorsBanner } from "@/components/SponsorsBanner";
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
        <CoachFinder />
        <SponsorsBanner />
        <ProductsGrid />
        <FooterClose />
      </main>
      <Footer />
    </>
  );
}
