"use client";

/* ──────────────────────────────────────────────
   FilterContext — comparte los filtros de coaches
   (país, idioma, especialidad) entre HeroSection
   y NetworkSection para que no haya estados
   desincronizados.

   Uso:
     <FilterProvider>
       <HeroSection />
       <NetworkSection />
     </FilterProvider>

     const { country, setCountry, ... } = useFilters();
   ────────────────────────────────────────────── */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface FilterState {
  country: string;
  language: string;
  specialty: string;
  /** Toggle "Solo certificados" — oculta coaches base y ex-certificados.
   *  Cuando está activado, solo se muestran HQ + certified-active. */
  certifiedOnly: boolean;
  setCountry: (v: string) => void;
  setLanguage: (v: string) => void;
  setSpecialty: (v: string) => void;
  setCertifiedOnly: (v: boolean) => void;
  resetAll: () => void;
  hasAnyFilter: boolean;
}

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState("all");
  const [language, setLanguage] = useState("all");
  const [specialty, setSpecialty] = useState("all");
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  const hasAnyFilter =
    country !== "all" || language !== "all" || specialty !== "all" || certifiedOnly;

  const resetAll = () => {
    setCountry("all");
    setLanguage("all");
    setSpecialty("all");
    setCertifiedOnly(false);
  };

  return (
    <FilterContext.Provider
      value={{
        country, language, specialty, certifiedOnly,
        setCountry, setLanguage, setSpecialty, setCertifiedOnly,
        resetAll, hasAnyFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterState {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error(
      "useFilters must be used within a <FilterProvider>.",
    );
  }
  return ctx;
}
