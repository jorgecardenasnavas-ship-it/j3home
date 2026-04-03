"use client";

import { useSyncExternalStore, useCallback, useState, useEffect, type ReactNode } from "react";
import type { Dictionary } from "./dictionaries/types";
import { es } from "./dictionaries/es";

export type Locale = "es" | "en" | "fr" | "sv" | "pt";

/* ── Dictionary cache (es is always available, others loaded on demand) ── */

const loaded: Record<string, Dictionary> = { es };

async function loadDict(locale: Locale): Promise<Dictionary> {
  if (loaded[locale]) return loaded[locale];
  switch (locale) {
    case "en": { const m = await import("./dictionaries/en"); loaded.en = m.en; return m.en; }
    case "fr": { const m = await import("./dictionaries/fr"); loaded.fr = m.fr; return m.fr; }
    case "sv": { const m = await import("./dictionaries/sv"); loaded.sv = m.sv; return m.sv; }
    case "pt": { const m = await import("./dictionaries/pt"); loaded.pt = m.pt; return m.pt; }
    default: return es;
  }
}

/* ── Global store (singleton, no React Context needed) ── */

type Listener = () => void;

let currentLocale: Locale = "es";
let currentDict: Dictionary = es;
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
  const [dict, setDict] = useState<Dictionary>(currentDict);

  const setLocale = useCallback((l: Locale) => {
    if (l === currentLocale) return;
    currentLocale = l;
    if (typeof window !== "undefined") {
      document.documentElement.lang = l;
    }
    // Load dictionary then update
    loadDict(l).then((d) => {
      currentDict = d;
      emitChange();
    });
    emitChange(); // trigger re-render for locale change
  }, []);

  // Keep dict in sync with global state
  useEffect(() => {
    if (loaded[locale]) {
      setDict(loaded[locale]);
    } else {
      loadDict(locale).then((d) => setDict(d));
    }
  }, [locale]);

  return { locale, setLocale, t: dict };
}

/* ── Provider (thin wrapper — just renders children) ── */

export function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
