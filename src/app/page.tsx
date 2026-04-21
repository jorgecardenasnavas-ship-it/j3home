import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SponsorsBanner } from "@/components/SponsorsBanner";
import { ProductsGrid } from "@/components/ProductsGrid";
import { FooterClose } from "@/components/FooterClose";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SponsorsBanner />
        <ProductsGrid />
        <FooterClose />
      </main>
      <Footer />
    </>
  );
}
