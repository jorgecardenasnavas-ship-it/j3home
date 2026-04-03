"use client";

import { useSyncExternalStore, useCallback, type ReactNode } from "react";
import type { Dictionary } from "./dictionaries/types";
import { es } from "./dictionaries/es";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import { sv } from "./dictionaries/sv";
import { pt } from "./dictionaries/pt";

export type Locale = "es" | "en" | "fr" | "sv" | "pt";

const dictionaries: Record<Locale, Dictionary> = { es, en, fr, sv, pt };

/* ── Global store (singleton, no React Context needed) ── */

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

export function setGlobalLocale(l: Locale) {
  if (l === currentLocale) return;
  currentLocale = l;
  if (typeof window !== "undefined") {
    document.documentElement.lang = l;
  }
  emitChange();
}

/* ── Hook ── */

export function useI18n() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((l: Locale) => {
    setGlobalLocale(l);
  }, []);

  return { locale, setLocale, t: dictionaries[locale] };
}

/* ── Provider (thin wrapper — just renders children) ── */

export function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
