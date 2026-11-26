import type { Metadata } from "next";
import { plusJakartaSans, newsreader } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fintara.capital"),
  title: {
    default: "Fintara Capital — Institutional Loan Advisory & Debt Desk",
    template: "%s | Fintara Capital",
  },
  description:
    "India's premier institutional loan advisory desk. Compare Home Loans, Loan Against Property (LAP), Unsecured Business Loans, and Balance Transfers across 18+ leading banks and NBFCs with zero borrower fees.",
  keywords: [
    "Fintara Capital",
    "fintara.capital",
    "Institutional Loan Advisory",
    "Home Loan Raipur",
    "Home Loans India",
    "Loan Against Property LAP",
    "Unsecured Business Loan MSME",
    "Personal Loan Salaried",
    "Loan Balance Transfer Refinance",
    "Mortgage Advisor India",
    "CIBIL Score Optimization",
    "Raipur Loan Desk",
  ],
  authors: [{ name: "Fintara Capital", url: "https://fintara.capital" }],
  creator: "Fintara Capital",
  publisher: "Fintara Capital",
  icons: {
    icon: "/brand/mark.svg",
    shortcut: "/brand/mark.svg",
    apple: "/brand/mark.svg",
  },
  openGraph: {
    title: "Fintara Capital — Loans Curated Across 18+ National Lenders",
    description:
      "Algorithmic rate arbitrage, maximum LTV, and doorstep in-principle sanctions across 18+ national banks and AAA-rated NBFCs. 100% free for borrowers.",
    url: "https://fintara.capital",
    siteName: "Fintara Capital",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/brand/logo-horizontal.svg",
        width: 1200,
        height: 630,
        alt: "Fintara Capital — Institutional Loan Advisory Desk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fintara Capital — Institutional Debt Advisory",
    description:
      "Home Loans, LAP, Business Loans & Balance Transfers across 18+ national banks with zero borrower fees.",
    creator: "@fintaracapital",
    images: ["/brand/logo-horizontal.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { AppProviders } from "@/components/providers/AppProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${newsreader.variable}`}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
