import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy — La academia de pádel de referencia en la Costa del Sol",
  description:
    "Programas Juniors, Adultos e Intensive Training. Formamos jugadores, desarrollamos personas, construimos carreras. Entrenamientos en Málaga.",
  openGraph: {
    title: "J3Pádel Academy — La academia de referencia en la Costa del Sol",
    description:
      "Programas Juniors, Adultos e Intensive Training. Formamos jugadores, desarrollamos personas, construimos carreras.",
  },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
