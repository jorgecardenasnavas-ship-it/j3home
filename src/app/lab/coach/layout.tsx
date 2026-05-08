import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "J3 Lab Coach — Programa formativo de coaches",
  description:
    "La FIP te habilita. J3 te hace bueno. Programa formativo para coaches de pádel: dos rutas, examen práctico, mentor 1:1 y verificación J3. De Rookie a Verificado.",
  alternates: {
    canonical: "/lab/coach",
  },
  openGraph: {
    title: "J3 Lab Coach — La FIP te habilita. J3 te hace bueno.",
    description:
      "Programa formativo para coaches de pádel. Método, criterio y comunidad. De Rookie a Verificado J3.",
    type: "website",
    url: "/lab/coach",
  },
  twitter: {
    card: "summary_large_image",
    title: "J3 Lab Coach — La FIP te habilita. J3 te hace bueno.",
    description: "Programa formativo para coaches de pádel. De Rookie a Verificado J3.",
  },
};

export default function LabCoachLayout({ children }: { children: React.ReactNode }) {
  return children;
}
