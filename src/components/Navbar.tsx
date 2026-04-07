"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n, type Locale } from "@/i18n/context";


/* Primary nav links (flat) */
const primaryLinks = [
  { label: "Coach360", href: "/coach360" },
  { label: "Academy", href: "/academy" },
  { label: "J3PTV", href: "/j3ptv" },
  { label: "Story", href: "/story" },
] as const;

/* Grouped under "Soluciones" dropdown */
const solucionesLinks = [
  { label: "Business", href: "/business" },
  { label: "Experience", href: "/experience" },
  { label: "Partner", href: "/partner" },
] as const;

/* All links combined (for mobile) */
const allLinks = [...primaryLinks.slice(0, 2), ...solucionesLinks, ...primaryLinks.slice(2)] as const;

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

  // Soluciones dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

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

  // Filter out link for current page
  const visiblePrimary = primaryLinks.filter((l) => l.href !== pathname);
  const visibleSoluciones = solucionesLinks.filter((l) => l.href !== pathname);
  const isOnSolucionesPage = solucionesLinks.some((l) => l.href === pathname);

  // Desktop: split primary links around center (home icon)
  const half = Math.ceil(visiblePrimary.length / 2);

  function openDropdown() {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  }
  function closeDropdown() {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  }

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
  const mobileLinks = allLinks.filter((l) => l.href !== pathname);

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
        <Link
          href="/"
          className="font-bold text-[15px] tracking-[4px] j3-grad-text no-underline"
        >
          J3P&Aacute;DEL
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden min-[961px]:flex gap-8 list-none items-center">
          {visiblePrimary.slice(0, half).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[12px] font-normal tracking-[1px] text-[var(--gy2)] no-underline uppercase hover:text-[var(--wh)] transition-colors duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Soluciones dropdown */}
          {visibleSoluciones.length > 0 && (
            <li
              ref={dropdownRef}
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button
                className={`group/prem relative flex items-center gap-[6px] text-[12px] font-medium tracking-[1.5px] uppercase no-underline transition-all duration-300 bg-transparent border-none cursor-pointer ${
                  isOnSolucionesPage || dropdownOpen ? "text-[var(--g1)]" : "text-[var(--gy2)] hover:text-[var(--g1)]"
                }`}
              >
                {/* Subtle glow behind on hover */}
                <span className="absolute inset-0 -inset-x-3 -inset-y-1 rounded-full bg-[var(--g1)]/0 group-hover/prem:bg-[var(--g1)]/[.06] transition-all duration-300" />
                {/* Star/diamond icon */}
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="relative opacity-60 group-hover/prem:opacity-100 transition-opacity duration-300">
                  <path d="M8 0l2.2 5.5L16 6.3l-4 3.7 1 5.5L8 12.8 2.9 15.5l1-5.5-4-3.7 5.9-.8z" />
                </svg>
                <span className="relative">{t.nav.soluciones}</span>
                <ChevronDown />
              </button>

              {/* Dropdown panel */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-[10px] min-w-[160px] py-3 px-1 rounded-lg bg-black/90 backdrop-blur-[20px] border border-white/[.08] shadow-[0_8px_32px_rgba(0,0,0,.6)] transition-all duration-200 ${
                  dropdownOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                {visibleSoluciones.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-[9px] text-[11px] font-normal tracking-[1px] uppercase text-[var(--gy2)] no-underline hover:text-[var(--wh)] hover:bg-white/[.04] rounded-md transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </li>
          )}

          {/* Home icon — only on subpages */}
          {!isHome && (
            <li>
              <Link
                href="/"
                className="text-[var(--gy2)] hover:text-[var(--wh)] transition-colors duration-300"
                aria-label="Inicio"
              >
                <HomeIcon />
              </Link>
            </li>
          )}

          {visiblePrimary.slice(half).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[12px] font-normal tracking-[1px] text-[var(--gy2)] no-underline uppercase hover:text-[var(--wh)] transition-colors duration-300"
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

          {/* Auth CTA */}
          <Link
            href="/login"
            className="flex items-center gap-2 text-[12px] font-bold tracking-[2px] uppercase text-[var(--g1)] no-underline hover:text-[var(--g2)] transition-colors duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {t.nav.acceder}
          </Link>
        </div>

        {/* Mobile: Lang + Hamburger */}
        <div className="min-[961px]:hidden flex items-center gap-4">
          {/* Mobile lang selector with dropdown */}
          <div className="relative">
            <button
              onClick={() => setMobileLangOpen(!mobileLangOpen)}
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
            onClick={() => setMenuOpen(!menuOpen)}
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
        {mobileLinks.filter(l => !solucionesLinks.some(s => s.href === l.href)).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="text-[18px] font-bold tracking-[3px] uppercase text-[var(--wh)] no-underline hover:text-[var(--g1)] transition-colors duration-300"
          >
            {link.label}
          </Link>
        ))}

        {/* Soluciones group */}
        {visibleSoluciones.length > 0 && (
          <>
            <span className="flex items-center gap-2 text-[9px] font-medium tracking-[3px] uppercase text-[var(--g1)] mt-2">
              <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" className="opacity-60">
                <path d="M8 0l2.2 5.5L16 6.3l-4 3.7 1 5.5L8 12.8 2.9 15.5l1-5.5-4-3.7 5.9-.8z" />
              </svg>
              {t.nav.soluciones}
            </span>
            {visibleSoluciones.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[16px] font-bold tracking-[3px] uppercase text-[var(--gy2)] no-underline hover:text-[var(--g1)] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </>
        )}

        {/* Language selector mobile */}
        <div className="flex items-center gap-4 mt-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLang(lang)}
              className={`text-[12px] font-bold tracking-[1px] uppercase transition-all duration-200 bg-transparent border-none cursor-pointer ${
                currentLang.code === lang.code
                  ? "text-[var(--g1)]"
                  : "text-[var(--gy)] hover:text-[var(--gy2)]"
              }`}
              aria-label={lang.label}
            >
              {lang.code}
            </button>
          ))}
        </div>

        {/* Auth CTA mobile */}
        <Link
          href="/login"
          onClick={() => setMenuOpen(false)}
          className="text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline cursor-pointer mt-3 flex items-center gap-2"
          style={{ background: "var(--j3-grad)", color: "#000" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {t.nav.acceder}
        </Link>
      </div>
    </>
  );
}
