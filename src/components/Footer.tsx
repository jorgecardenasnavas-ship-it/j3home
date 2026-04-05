"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";

const footerLinks = [
  { label: "Coach360", href: "/coach360" },
  { label: "Academy", href: "/academy" },
  { label: "Business", href: "/business" },
  { label: "Experience", href: "/experience" },
  { label: "Partner", href: "/partner" },
  { label: "J3PTV", href: "/j3ptv" },
  { label: "Story", href: "/story" },
] as const;

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-10 max-[960px]:py-8 px-12 max-[960px]:px-6 border-t border-white/[.06] flex items-center justify-between flex-wrap gap-4 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-5">
      {/* Logo */}
      <span className="font-bold text-[13px] max-[960px]:text-[14px] tracking-[4px] j3-grad-text">
        J3PÁDEL
      </span>

      {/* Links */}
      <div className="flex gap-5 max-[960px]:gap-4 flex-wrap">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[11px] max-[960px]:text-[12px] font-light tracking-[1px] uppercase text-[var(--gy2)] no-underline hover:text-[var(--wh)] transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Copyright */}
      <span className="text-[11px] max-[960px]:text-[12px] font-light text-[var(--gy2)]">
        {t.footer.copyright}
      </span>
    </footer>
  );
}
