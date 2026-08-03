import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAROSSERIA | Części blacharskie samochodowe",
  description: "Drzwi, maski, błotniki, zderzaki i kratki samochodowe. Oferta online na Allegro i Ovoko oraz odbiór osobisty.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl"><body>{children}</body></html>;
}
