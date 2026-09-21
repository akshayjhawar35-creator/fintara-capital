import type { Metadata } from "next";
import { ibmPlexSans, newsreader } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fintara-capital.vercel.app"),
  title: {
    default: "Fintara Capital — Loans, arranged across lenders",
    template: "%s | Fintara Capital",
  },
  description:
    "DSA loan facilitation desk and mortgage advisor in Raipur, Chhattisgarh. Compare Home Loans, LAP, Business Loans and Balance Transfers across 18+ banks and NBFCs.",
  keywords: [
    "Home Loan Raipur",
    "Loan Against Property Raipur",
    "Business Loan Chhattisgarh",
    "Loan Balance Transfer",
    "Fintara Capital",
    "DSA Raipur",
    "Loan Consultant Raipur",
  ],
  authors: [{ name: "Fintara Capital" }],
  icons: {
    icon: "/brand/mark.svg",
    shortcut: "/brand/mark.svg",
    apple: "/brand/mark.svg",
  },
  openGraph: {
    title: "Fintara Capital — Loans, arranged across lenders",
    description:
      "Direct Selling Agent (DSA) and loan advisory desk in Raipur, Chhattisgarh. Neutral comparison and doorstep processing across 18+ lenders.",
    url: "https://fintara-capital.vercel.app",
    siteName: "Fintara Capital",
    locale: "en_IN",
    type: "website",
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
      className={`${ibmPlexSans.variable} ${newsreader.variable}`}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
