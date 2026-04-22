"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Floating CTA pill — appears fixed bottom-right after the user scrolls past the hero.
 * Captures high-intent visitors without forcing them to consume the whole page.
 */
export function FloatingCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShow(window.scrollY > window.innerHeight * 0.7);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      href="/academy#map"
      className={`floating-cta ${show ? "in" : ""}`}
      aria-label="Reserva tu primera clase gratis"
    >
      <span className="floating-cta-text">Reserva clase gratis</span>
      <span className="floating-cta-arrow">→</span>
    </Link>
  );
}
