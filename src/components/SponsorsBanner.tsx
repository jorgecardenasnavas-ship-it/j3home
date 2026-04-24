"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useI18n } from "@/i18n/context";

export function SponsorsBanner() {
  const { t } = useI18n();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const logos = banner.querySelectorAll<HTMLElement>(".sp-logo");
    const line = banner.querySelector<HTMLElement>(".sp-line");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (line) line.classList.add("in");
            logos.forEach((logo, i) => {
              setTimeout(() => logo.classList.add("in"), 200 + i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(banner);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="partners"
      ref={bannerRef}
      className="bg-[var(--wh)] w-full py-8 max-[960px]:py-5 px-14 max-[960px]:px-6 flex flex-col items-center justify-center border-t border-black/[.06] overflow-hidden z-10"
    >
      {/* Gold line */}
      <div
        className="sp-line h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent mb-8 max-[960px]:mb-5"
        style={{ width: "100%", maxWidth: "400px" }}
      />

      <div className="inline-flex items-center flex-nowrap gap-[72px] max-[960px]:gap-10">
        {t.sponsors.items.map((s) => (
          <a
            key={s.alt}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="sp-logo j3-press"
          >
            <Image
              src={s.src}
              alt={s.alt}
              width={s.w}
              height={s.h}
              className="h-[52px] max-[960px]:h-9 w-auto object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
