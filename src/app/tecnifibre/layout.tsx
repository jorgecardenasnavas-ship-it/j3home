import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Una propuesta para Tecnifibre × Lacoste",
  description:
    "Propuesta privada de colaboración J3Pádel × Tecnifibre / Lacoste.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function TecnifibreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
