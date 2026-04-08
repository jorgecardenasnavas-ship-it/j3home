import type { Metadata } from "next";
import { Roboto_Condensed, Instrument_Serif } from "next/font/google";
import { ChatBubble } from "@/components/ChatBubble";
import { SmoothScroll } from "@/components/SmoothScroll";
import { I18nProvider } from "@/i18n/context";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://j3home.vercel.app"),
  title: {
    default: "J3Pádel — Play. Coach. Manage.",
    template: "%s | J3Pádel",
  },
  description: "La academia de pádel #1 en la Costa del Sol. Formación, gestión y alto rendimiento desde 2004.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "J3Pádel",
    title: "J3Pádel — Play. Coach. Manage.",
    description: "La academia de pádel #1 en la Costa del Sol. Formación, gestión y alto rendimiento desde 2004.",
  },
  twitter: {
    card: "summary_large_image",
    title: "J3Pádel — Play. Coach. Manage.",
    description: "La academia de pádel #1 en la Costa del Sol. Formación, gestión y alto rendimiento desde 2004.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${robotoCondensed.variable} ${instrumentSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bk)] text-[var(--wh)]">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <I18nProvider>
          <SmoothScroll>
            <main id="main-content">
              {children}
            </main>
            <ChatBubble />
          </SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
