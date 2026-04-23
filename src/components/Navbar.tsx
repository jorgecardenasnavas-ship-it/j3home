"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n, type Locale } from "@/i18n/context";


/* Nav links — split around center home icon */
const leftLinks = [
  { label: "Coach360", href: "https://j3padel.com/join", external: true },
  { label: "Academy", href: "/academy", external: false },
] as const;

const rightLinks = [
  { label: "Story", href: "/story", external: false },
  { label: "J3PTV", href: "/j3ptv", external: false },
  { label: "Experience", href: "/experience", external: false },
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

  const { locale, setLocale, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const currentLang = languages.find(l => l.code === locale) || languages[0];
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  function selectLang(lang: (typeof languages)[number]) {
    setLocale(lang.code as Locale);
    setLangOpen(false);
    setMobileLangOpen(false);
  }

  function handleNavClick(href: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === href) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
  }

  const mobileLinks = allNavLinks;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[110] h-[52px] flex items-center justify-between px-12 max-[960px]:px-6 border-b transition-all duration-300 ${
          scrolled
            ? "border-[rgba(27,61,47,0.12)] shadow-[0_1px_16px_rgba(27,61,47,0.08)]"
            : "border-[rgba(27,61,47,0.07)]"
        }`}
        style={{ background: "#fff" }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={handleNavClick("/")}
          className="flex items-center no-underline"
          aria-label="J3Pádel — Inicio"
        >
          <img
            src="/images/j3padel-text-dark.svg"
            alt="J3Pádel"
            className="h-[22px] w-auto select-none"
            draggable={false}
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden min-[961px]:flex gap-8 list-none items-center">
          {[...leftLinks].map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-normal tracking-[1px] no-underline uppercase transition-colors duration-300 text-[rgba(27,61,47,0.5)] hover:text-[var(--verde)]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  onClick={handleNavClick(link.href)}
                  className={`text-[12px] font-normal tracking-[1px] no-underline uppercase transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-[var(--g1)]"
                      : "text-[rgba(27,61,47,0.5)] hover:text-[var(--verde)]"
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}

          {/* Home — J3 ball logo, centered */}
          <li>
            <Link
              href="/"
              onClick={handleNavClick("/")}
              className="transition-opacity duration-300 hover:opacity-70"
              aria-label="Inicio"
            >
              <img
                src="/images/j3-ball-gold.svg"
                alt="J3"
                className="h-[20px] w-auto select-none"
                draggable={false}
              />
            </Link>
          </li>

          {[...rightLinks].map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-normal tracking-[1px] no-underline uppercase transition-colors duration-300 text-[rgba(27,61,47,0.5)] hover:text-[var(--verde)]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  onClick={handleNavClick(link.href)}
                  className={`text-[12px] font-normal tracking-[1px] no-underline uppercase transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-[var(--g1)]"
                      : "text-[rgba(27,61,47,0.5)] hover:text-[var(--verde)]"
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right side: Language + Auth */}
        <div className="hidden min-[961px]:flex items-center gap-5">
          {/* Language selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(prev => !prev)}
              className="flex items-center gap-[5px] text-[12px] font-normal tracking-[1px] uppercase text-[rgba(27,61,47,0.5)] hover:text-[var(--verde)] transition-colors duration-300 bg-transparent border-none cursor-pointer"
            >
              <GlobeIcon />
              <span>{currentLang.code.toUpperCase()}</span>
              <ChevronDown />
            </button>

            {/* Language dropdown */}
            <div
              className={`absolute top-full right-0 mt-[10px] min-w-[150px] py-2 px-1 rounded-lg bg-[rgba(14,28,22,0.95)] backdrop-blur-[20px] border border-white/[.08] shadow-[0_8px_32px_rgba(0,0,0,.4)] transition-all duration-200 ${
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
          <span className="w-px h-4 bg-[rgba(27,61,47,0.15)]" />

          {/* Auth CTA — icon only */}
          <Link
            href="/login"
            className="flex items-center text-[var(--verde)] no-underline hover:text-[var(--g1)] transition-colors duration-300"
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
          {/* Mobile lang selector */}
          <div className="relative">
            <button
              onClick={() => { setMobileLangOpen(!mobileLangOpen); setMenuOpen(false); }}
              className="flex items-center gap-[4px] text-[11px] font-normal tracking-[1px] uppercase text-[rgba(27,61,47,0.55)] bg-transparent border-none cursor-pointer"
              aria-label="Cambiar idioma"
            >
              <GlobeIcon size={13} />
              <span>{currentLang.code.toUpperCase()}</span>
            </button>

            {/* Mobile lang dropdown */}
            <div
              className={`absolute top-full right-0 mt-3 min-w-[140px] py-2 px-1 rounded-lg bg-[rgba(14,28,22,0.95)] backdrop-blur-[20px] border border-white/[.08] shadow-[0_8px_32px_rgba(0,0,0,.4)] transition-all duration-200 ${
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
            <span className={`block w-5 h-[1.5px] bg-[var(--verde)] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-[var(--verde)] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-[var(--verde)] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-[rgba(14,28,22,0.97)] backdrop-blur-[30px] flex flex-col items-center justify-center gap-7 transition-all duration-500 min-[961px]:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Home link */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            setMenuOpen(false);
          }}
          className={`text-[18px] font-bold tracking-[3px] uppercase no-underline transition-colors duration-300 flex items-center gap-3 ${
            isHome ? "text-[var(--g1)]" : "text-[var(--wh)] hover:text-[var(--g1)]"
          }`}
        >
          <img src="/images/j3-ball-gold.svg" alt="J3" className="h-[18px] w-auto select-none" draggable={false} />
          {t.nav.inicio}
        </Link>

        {mobileLinks.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-[18px] font-bold tracking-[3px] uppercase no-underline transition-colors duration-300 text-[var(--wh)] hover:text-[var(--g1)]"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (pathname === link.href) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                setMenuOpen(false);
              }}
              className={`text-[18px] font-bold tracking-[3px] uppercase no-underline transition-colors duration-300 ${
                pathname === link.href ? "text-[var(--g1)]" : "text-[var(--wh)] hover:text-[var(--g1)]"
              }`}
            >
              {link.label}
            </Link>
          ),
        )}

        {/* Auth CTA mobile */}
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
