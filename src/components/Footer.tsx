"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";


/* Footer navigation. Priorizamos las rutas que tienen página real
   (no 404). Las que están pendientes de desarrollo (Business, Partner,
   J3PTV) se reintroducirán cuando sus páginas existan — mejor no
   publicar links rotos. */
const footerLinks = [
  { label: "Academy", href: "/academy", external: false },
  { label: "El Sello", href: "/sello", external: false },
  { label: "Para Clubes", href: "/clubes", external: false },
  { label: "Experience", href: "/experience", external: false },
  { label: "Story", href: "/story", external: false },
  { label: "Coach360", href: "https://j3padel.com/join", external: true },
] as const;

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative border-t border-white/[.08] overflow-hidden bg-black">
      {/* Subtle radial glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,169,110,.2) 50%, transparent)",
        }}
      />

      <div className="py-12 max-[960px]:py-10 px-12 max-[960px]:px-6 flex items-center justify-between flex-wrap gap-6 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-6">
        {/* Logo + tagline */}
        <div className="flex flex-col gap-2">
          <img
            src="/images/j3padel-logo.svg"
            alt="J3Pádel"
            className="h-[44px] w-auto select-none"
            draggable={false}
          />
          <span className="text-[10px] font-light tracking-[2px] uppercase text-[var(--gy)]">
            Play · Coach · Manage
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-5 max-[960px]:gap-4 flex-wrap">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="j3-press text-[11px] max-[960px]:text-[12px] font-light tracking-[1px] uppercase text-[var(--gy2)] no-underline hover:text-[var(--wh)] transition-colors duration-200 ease-[var(--ease-out)]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="j3-press text-[11px] max-[960px]:text-[12px] font-light tracking-[1px] uppercase text-[var(--gy2)] no-underline hover:text-[var(--wh)] transition-colors duration-200 ease-[var(--ease-out)]"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Social + copyright */}
        <div className="flex flex-col items-end max-[960px]:items-start gap-3">
          {/* Social icons */}
          <div className="flex gap-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/j3padel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="j3-press w-8 h-8 rounded-full border border-white/[.08] flex items-center justify-center text-[var(--gy2)] hover:text-[var(--wh)] hover:border-white/[.2] transition-[color,border-color] duration-200 ease-[var(--ease-out)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@j3padel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="j3-press w-8 h-8 rounded-full border border-white/[.08] flex items-center justify-center text-[var(--gy2)] hover:text-[var(--wh)] hover:border-white/[.2] transition-[color,border-color] duration-200 ease-[var(--ease-out)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1c.4-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z" />
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@j3padel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="j3-press w-8 h-8 rounded-full border border-white/[.08] flex items-center justify-center text-[var(--gy2)] hover:text-[var(--wh)] hover:border-white/[.2] transition-[color,border-color] duration-200 ease-[var(--ease-out)]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.1a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.81.07 4.84 4.84 0 01-2.38-.64V6.69h4z" />
              </svg>
            </a>
          </div>
          <span className="text-[11px] max-[960px]:text-[12px] font-light text-[var(--gy)]">
            {t.footer.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}
