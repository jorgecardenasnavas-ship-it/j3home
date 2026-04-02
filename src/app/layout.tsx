import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "J3Pádel",
  description: "Play. Coach. Manage. La academia de pádel #1 en la Costa del Sol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${robotoCondensed.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bk)] text-[var(--wh)]">
        {children}
      </body>
    </html>
  );
}
