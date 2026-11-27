import type { Metadata } from "next";
import { plusJakartaSans, newsreader } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fintara.capital"),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "Fintara Capital — Home Loans, LAP, Project Finance & Working Capital",
    template: "%s | Fintara Capital",
  },
  description:
    "Fintara Capital is a Pan-India loan advisory desk at Office No. 421, Walfort Omega, Raipur (C.G.). Compare Home Loans, LAP, New Project Loans, Working Capital (Secured & Unsecured CC/OD), Business & Personal Loans across 18+ banks and NBFCs.",
  keywords: [
    "Fintara Capital",
    "fintara.capital",
    "Home Loan Raipur",
    "Loan Against Property Raipur",
    "New Project Loans India",
    "Working Capital Limits CC OD",
    "Unsecured Business Loan",
    "Personal Loan",
    "Loan Balance Transfer",
    "Loan Consultant Raipur",
    "Walfort Omega Raipur",
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
    title: "Fintara Capital — Smart Loan Structuring Across 18+ Banks & NBFCs",
    description:
      "Home Loans, LAP, New Project Loans, Working Capital (Secured & Unsecured CC/OD), Business & Personal Loans across 18+ banks and NBFCs with zero borrower fee.",
    url: "https://fintara.capital",
    siteName: "Fintara Capital",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/brand/og-card.png",
        width: 1200,
        height: 630,
        alt: "Fintara Capital — Pan-India Loan Advisory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fintara Capital — Pan-India Loan Advisory",
    description:
      "Home Loans, LAP, Project Loans & Working Capital Limits across 18+ banks with zero borrower fee.",
    creator: "@fintaracapital",
    images: ["/brand/og-card.png"],
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
