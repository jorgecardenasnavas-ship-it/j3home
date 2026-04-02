"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Dictionary } from "./dictionaries/types";
import { es } from "./dictionaries/es";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import { sv } from "./dictionaries/sv";
import { pt } from "./dictionaries/pt";

export type Locale = "es" | "en" | "fr" | "sv" | "pt";

const dictionaries: Record<Locale, Dictionary> = { es, en, fr, sv, pt };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextType>({
  locale: "es",
  setLocale: () => {},
  t: es,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
