"use client";

import Link from "next/link";

const footerLinks = [
  { label: "Coach360", href: "/coach360" },
  { label: "J3PTV", href: "/j3ptv" },
  { label: "Academy", href: "/academy" },
  { label: "Franquicia", href: "/franquicia" },
  { label: "Experience", href: "/experience" },
  { label: "Story", href: "/nosotros" },
] as const;

export function Footer() {
  return (
    <footer className="py-8 max-[960px]:py-6 px-12 max-[960px]:px-6 border-t border-white/[.06] flex items-center justify-between flex-wrap gap-4 max-[960px]:flex-col max-[960px]:items-start">
      {/* Logo */}
      <span className="font-bold text-[13px] tracking-[4px] j3-grad-text">
        J3PÁDEL
      </span>

      {/* Links */}
      <div className="flex gap-5 flex-wrap">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[11px] font-light tracking-[1px] uppercase text-[var(--gy)] no-underline hover:text-[var(--gy2)] transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Copyright */}
      <span className="text-[11px] font-light text-[var(--gy)]">
        &copy; 2025 J3Pádel
      </span>
    </footer>
  );
}
