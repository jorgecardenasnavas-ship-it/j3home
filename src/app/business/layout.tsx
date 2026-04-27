import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business — Diseña y construye tu academia de pádel",
  description:
    "Consultoría 1-a-1 para emprendedores que van a abrir una academia. Dos peldaños. Sin curso barato. Sin distracciones.",
  openGraph: {
    title: "J3Pádel Business — Diseña y construye tu academia",
    description:
      "Consultoría 1-a-1 para emprendedores que van a abrir una academia. Dos peldaños. Sin curso barato. Sin distracciones.",
  },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
