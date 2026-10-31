import { Amiri, Cormorant_Garamond, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";

export const displayLatin = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display-latin",
  display: "swap",
});

export const bodyLatin = Manrope({
  subsets: ["latin"],
  variable: "--font-body-latin",
  display: "swap",
});

export const displayArabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-display-arabic",
  display: "swap",
  preload: false,
});

export const bodyArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-body-arabic",
  display: "swap",
  preload: false,
});

export const fontVariables = [displayLatin, bodyLatin, displayArabic, bodyArabic]
  .map((font) => font.variable)
  .join(" ");
