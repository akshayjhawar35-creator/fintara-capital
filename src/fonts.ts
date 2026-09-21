import { IBM_Plex_Sans, Newsreader } from "next/font/google";

/**
 * IBM Plex Sans — primary UI font.
 * Excellent tabular numerals for financial data.
 * Used everywhere in the staff app.
 */
export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

/**
 * Newsreader — serif font for public-site headlines.
 * Creates a clear, trustworthy contrast with the sans body.
 */
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});
