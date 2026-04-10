"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n, type Locale } from "@/i18n/context";


/* Nav links — split around center home icon */
const leftLinks = [
  { label: "Coach360", href: "/coach360" },
  { label: "Academy", href: "/academy" },
] as const;

const rightLinks = [
  { label: "Story", href: "/story" },
  { label: "J3PTV", href: "/j3ptv" },
  { label: "Experience", href: "/experience" },
] as const;

const allNavLinks = [...leftLinks, ...rightLinks] as const;

/* Languages */
const languages = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "sv", label: "Svenska" },
  { code: "pt", label: "Português" },
] as const;

const GlobeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const HomeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L10 3.5L17 10.5" />
    <path d="M5 9v7.5a1 1 0 001 1h3v-4.5h2v4.5h3a1 1 0 001-1V9" />
  </svg>
);

const ChevronDown = () => (
  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-[3px] mt-[1px]">
    <path d="M3 4.5L6 7.5L9 4.5" />
  </svg>
);

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Language — connected to i18n context
  const { locale, setLocale, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const currentLang = languages.find(l => l.code === locale) || languages[0];
  const langTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile: filter out current page; Desktop: show all (highlight active)
  const visibleLeft = leftLinks;
  const visibleRight = rightLinks;

  function openLang() {
    if (langTimeout.current) clearTimeout(langTimeout.current);
    setLangOpen(true);
  }
  function closeLang() {
    langTimeout.current = setTimeout(() => setLangOpen(false), 150);
  }

  function selectLang(lang: (typeof languages)[number]) {
    setLocale(lang.code as Locale);
    setLangOpen(false);
    setMobileLangOpen(false);
  }

  // All visible links for mobile
  const mobileLinks = allNavLinks.filter((l) => l.href !== pathname);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-100 h-[52px] flex items-center justify-between px-12 max-[960px]:px-6 backdrop-blur-[20px] border-b transition-all duration-500 ${
          scrolled
            ? "bg-black/85 border-white/[.07] shadow-[0_1px_20px_rgba(0,0,0,.5)]"
            : "bg-black/60 border-white/[.04]"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center no-underline" aria-label="J3Pádel — Inicio">
          <img
            src="/images/j3padel-logo.svg"
            alt="J3Pádel"
            className="h-[40px] w-auto select-none"
            draggable={false}
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden min-[961px]:flex gap-8 list-none items-center">
          {visibleLeft.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[12px] font-normal tracking-[1px] no-underline uppercase transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-[var(--g1)]"
                    : "text-[var(--gy2)] hover:text-[var(--wh)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Home icon — gold, always centered */}
          <li>
            <Link
              href="/"
              className={`transition-colors duration-300 ${
                isHome ? "text-[var(--g1)]" : "text-[var(--g1)] hover:text-[var(--g2)]"
              }`}
              aria-label="Inicio"
            >
              <HomeIcon />
            </Link>
          </li>

          {visibleRight.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[12px] font-normal tracking-[1px] no-underline uppercase transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-[var(--g1)]"
                    : "text-[var(--gy2)] hover:text-[var(--wh)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Language + Auth */}
        <div className="hidden min-[961px]:flex items-center gap-5">
          {/* Language selector */}
          <div
            className="relative"
            onMouseEnter={openLang}
            onMouseLeave={closeLang}
          >
            <button
              className="flex items-center gap-[5px] text-[12px] font-normal tracking-[1px] uppercase text-[var(--gy2)] hover:text-[var(--wh)] transition-colors duration-300 bg-transparent border-none cursor-pointer"
            >
              <GlobeIcon />
              <span>{currentLang.code.toUpperCase()}</span>
              <ChevronDown />
            </button>

            {/* Language dropdown */}
            <div
              className={`absolute top-full right-0 mt-[10px] min-w-[150px] py-2 px-1 rounded-lg bg-black/90 backdrop-blur-[20px] border border-white/[.08] shadow-[0_8px_32px_rgba(0,0,0,.6)] transition-all duration-200 ${
                langOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLang(lang)}
                  className={`w-full flex items-center gap-3 px-3 py-[8px] text-[11px] font-normal tracking-[0.5px] bg-transparent border-none cursor-pointer rounded-md transition-all duration-200 ${
                    currentLang.code === lang.code
                      ? "text-[var(--wh)] bg-white/[.06]"
                      : "text-[var(--gy2)] hover:text-[var(--wh)] hover:bg-white/[.04]"
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-50 w-5">{lang.code}</span>
                  <span>{lang.label}</span>
                  {currentLang.code === lang.code && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="var(--g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <span className="w-px h-4 bg-white/10" />

          {/* Auth CTA — icon only */}
          <Link
            href="/login"
            className="flex items-center text-[var(--g1)] no-underline hover:text-[var(--g2)] transition-colors duration-300"
            aria-label={t.nav.acceder}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>

        {/* Mobile: Lang + Hamburger */}
        <div className="min-[961px]:hidden flex items-center gap-4">
          {/* Mobile lang selector with dropdown */}
          <div className="relative">
            <button
              onClick={() => { setMobileLangOpen(!mobileLangOpen); setMenuOpen(false); }}
              className="flex items-center gap-[4px] text-[11px] font-normal tracking-[1px] uppercase text-[var(--gy2)] bg-transparent border-none cursor-pointer"
              aria-label="Cambiar idioma"
            >
              <GlobeIcon size={13} />
              <span>{currentLang.code.toUpperCase()}</span>
            </button>

            {/* Mobile lang dropdown */}
            <div
              className={`absolute top-full right-0 mt-3 min-w-[140px] py-2 px-1 rounded-lg bg-black/95 backdrop-blur-[20px] border border-white/[.08] shadow-[0_8px_32px_rgba(0,0,0,.6)] transition-all duration-200 ${
                mobileLangOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { selectLang(lang); setMobileLangOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-[9px] text-[12px] font-normal tracking-[0.5px] bg-transparent border-none cursor-pointer rounded-md transition-all duration-200 ${
                    currentLang.code === lang.code
                      ? "text-[var(--wh)] bg-white/[.06]"
                      : "text-[var(--gy2)] hover:text-[var(--wh)] hover:bg-white/[.04]"
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-[1px] uppercase opacity-50 w-5">{lang.code}</span>
                  <span>{lang.label}</span>
                  {currentLang.code === lang.code && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="var(--g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hamburger */}
          <button
            className="flex flex-col justify-center items-center gap-[5px] w-8 h-8 cursor-pointer bg-transparent border-none"
            onClick={() => { setMenuOpen(!menuOpen); setLangOpen(false); setMobileLangOpen(false); }}
            aria-label="Menu"
          >
          <span
            className={`block w-5 h-[1.5px] bg-[var(--wh)] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-[var(--wh)] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-[var(--wh)] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
          />
        </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-90 bg-black/95 backdrop-blur-[30px] flex flex-col items-center justify-center gap-7 transition-all duration-500 min-[961px]:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Home link — only on subpages */}
        {!isHome && (
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-[18px] font-bold tracking-[3px] uppercase text-[var(--wh)] no-underline hover:text-[var(--g1)] transition-colors duration-300 flex items-center gap-3"
          >
            <HomeIcon size={18} />
            {t.nav.inicio}
          </Link>
        )}

        {/* Main links */}
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="text-[18px] font-bold tracking-[3px] uppercase text-[var(--wh)] no-underline hover:text-[var(--g1)] transition-colors duration-300"
          >
            {link.label}
          </Link>
        ))}

        {/* Auth CTA mobile — icon only */}
        <Link
          href="/login"
          onClick={() => setMenuOpen(false)}
          className="flex items-center justify-center w-11 h-11 rounded-full no-underline cursor-pointer mt-3"
          style={{ background: "var(--j3-grad)", color: "#000" }}
          aria-label={t.nav.acceder}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
      </div>
    </>
  );
}
