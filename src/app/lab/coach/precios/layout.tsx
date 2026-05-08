import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios — J3 Lab Coach",
  description:
    "Cuatro modelos de cobro, una sola lógica: pagas por lo que avanzas. Plan Coach desde 19€/mes, examen de certificación 490€, Mentor J3 1:1, Verificación gratis por mérito.",
  alternates: {
    canonical: "/lab/coach/precios",
  },
  openGraph: {
    title: "J3 Lab Coach — Precios transparentes",
    description:
      "El camino completo de coach: suscripción, examen, Mentor 1:1 y Verificación J3.",
    type: "website",
    url: "/lab/coach/precios",
  },
  twitter: {
    card: "summary_large_image",
    title: "J3 Lab Coach — Precios transparentes",
    description:
      "El camino completo de coach: suscripción, examen, Mentor 1:1 y Verificación J3.",
  },
};

export default function PreciosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
