"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Coach360", href: "/coach360" },
  { label: "Academy", href: "/academy" },
  { label: "J3PTV", href: "/j3ptv" },
  { label: "Story", href: "/nosotros" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          href="#"
          className="font-bold text-[15px] tracking-[4px] j3-grad-text no-underline"
        >
          J3PÁDEL
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden min-[961px]:flex gap-9 list-none">
          {navLinks.map((link) => (
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

        {/* Desktop Contact CTA */}
        <Link
          href="#contacto"
          className="hidden min-[961px]:block text-[12px] font-bold tracking-[2px] uppercase text-[var(--g1)] no-underline hover:text-[var(--g2)] transition-colors duration-300"
        >
          Contacto
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="min-[961px]:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 cursor-pointer bg-transparent border-none"
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
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-90 bg-black/95 backdrop-blur-[30px] flex flex-col items-center justify-center gap-8 transition-all duration-500 min-[961px]:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="text-[18px] font-bold tracking-[3px] uppercase text-[var(--wh)] no-underline hover:text-[var(--g1)] transition-colors duration-300"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="#contacto"
          onClick={() => setMenuOpen(false)}
          className="text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline cursor-pointer mt-4"
          style={{ background: "var(--j3-grad)", color: "#000" }}
        >
          Contacto
        </Link>
      </div>
    </>
  );
}
