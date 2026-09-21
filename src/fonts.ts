import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";

/**
 * Plus Jakarta Sans — primary UI & fintech display font.
 * Recognized as the gold-standard font for modern financial tech
 * (clean geometric curves, ultra-crisp tabular numbers, eye-catching readability).
 */
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

/**
 * Newsreader — editorial serif font for public-site headlines.
 * Creates an authoritative, institutional private-banking contrast.
 */
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});
