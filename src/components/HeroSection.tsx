"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeroClaim } from "@/components/HeroClaim";
import { HeroOrbital } from "@/components/HeroOrbital";
import {
  HOME_PRODUCTS,
  type HomeProduct,
  type HomeProductAudience,
} from "@/data/home-products";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [activeAudience, setActiveAudience] = useState<HomeProductAudience>(
    () => HOME_PRODUCTS.find((p) => p.id === "training-camp")?.audience ?? "play",
  );

  const handleActiveChange = useCallback((product: HomeProduct) => {
    setActiveAudience(product.audience);
  }, []);

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    const curtain = section.querySelector<HTMLElement>(".hero-curtain");
    const shimmer = section.querySelector<HTMLElement>(".hero-shimmer");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            curtain?.classList.add("in");
            // HeroClaim manages its own word stagger (900, 1400, 1900ms post-mount)
            // Shimmer fires after the last word (~2400ms)
            setTimeout(() => shimmer?.classList.add("in"), 2400);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="h-[58vh] min-h-[460px] relative overflow-hidden flex flex-col justify-end max-[960px]:h-[65vh]"
    >
      {/* Background — solid black */}
      <div className="absolute inset-0 bg-black" />

      {/* Black curtain */}
      <div className="hero-curtain absolute inset-0 z-[4] bg-black pointer-events-none" />

      {/* Gold accent line top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)]/20 to-transparent z-[5]" />

      {/* Golden shimmer sweep */}
      <div className="hero-shimmer absolute inset-0 z-[3] pointer-events-none opacity-0">
        <div className="hero-shimmer-bar absolute top-0 left-0 w-full h-full" />
      </div>

      {/* Content grid — claim left, orbital right (desktop) / stacked (mobile) */}
      <div className="relative z-[5] w-full h-full grid grid-cols-[45%_55%] max-[960px]:grid-cols-1 items-center px-12 max-[960px]:px-6">
        {/* Claim */}
        <div className="flex items-center max-[960px]:mb-4">
          <HeroClaim activeAudience={activeAudience} />
        </div>
        {/* Orbital */}
        <div className="relative h-full max-[960px]:h-auto">
          <HeroOrbital onActiveChange={handleActiveChange} />
        </div>
      </div>
    </section>
  );
}
