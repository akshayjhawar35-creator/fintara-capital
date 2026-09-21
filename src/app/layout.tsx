import type { Metadata } from "next";
import { ibmPlexSans, newsreader } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fintara Loan Desk",
  description: "Loan case tracking and CRM for Fintara Capital",
  icons: {
    icon: "/brand/mark.svg",
  },
};

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
      <body>{children}</body>
    </html>
  );
}
