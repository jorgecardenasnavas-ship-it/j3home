"use client";

import { useSyncExternalStore, useCallback, type ReactNode } from "react";
import type { Dictionary } from "./dictionaries/types";
import { es } from "./dictionaries/es";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import { sv } from "./dictionaries/sv";
import { pt } from "./dictionaries/pt";

export type Locale = "es" | "en" | "fr" | "sv" | "pt";

/* ── Force all dictionaries into the bundle ── */
/* The switch ensures each import is reachable at runtime */
function getDict(locale: Locale): Dictionary {
  switch (locale) {
    case "es": return es;
    case "en": return en;
    case "fr": return fr;
    case "sv": return sv;
    case "pt": return pt;
  }
}

/* ── Global store (singleton) ── */

type Listener = () => void;

let currentLocale: Locale = "es";
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((fn) => fn());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return "es";
}

/* ── Hook ── */

export function useI18n() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((l: Locale) => {
    if (l === currentLocale) return;
    currentLocale = l;
    if (typeof window !== "undefined") {
      document.documentElement.lang = l;
    }
    emitChange();
  }, []);

  return { locale, setLocale, t: getDict(locale) };
}

/* ── Provider (passthrough — kept for layout.tsx compatibility) ── */

export function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
