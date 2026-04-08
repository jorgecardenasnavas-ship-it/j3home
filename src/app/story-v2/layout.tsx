import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra Historia · v2",
  description: "Más de 20 años formando jugadores y entrenadores de pádel. La historia de J3Pádel desde 2004.",
  openGraph: {
    title: "Nuestra Historia | J3Pádel",
    description: "Más de 20 años formando jugadores y entrenadores de pádel. La historia de J3Pádel desde 2004.",
  },
};

export default function StoryV2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
