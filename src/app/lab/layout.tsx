import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "J3 Lab — Formación digital para coaches y jugadores de pádel",
  description:
    "La pata de formación digital de J3 Padel. Programas para coaches (3 tiers progresivos: Coach, Pro Coach, Head Coach) y para jugadores amateurs. Mismo método J3, dos caminos.",
  alternates: {
    canonical: "/lab",
  },
  openGraph: {
    title: "J3 Lab — Formación digital de J3 Padel",
    description:
      "Programas digitales para coaches y jugadores. Mismo método J3, dos caminos.",
    type: "website",
    url: "/lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "J3 Lab — Formación digital de J3 Padel",
    description: "Programas digitales para coaches y jugadores.",
  },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
