import React from "react";

interface JsonLdProps {
  type?: "Organization" | "FinancialService" | "FAQPage" | "LoanOrCredit" | "Article" | "BreadcrumbList";
  data?: Record<string, any>;
}

export function JsonLd({ type = "FinancialService", data }: JsonLdProps) {
  const baseOrganization = {
    "@context": "https://schema.org",
    "@type": ["FinancialService", "LocalBusiness"],
    name: "Fintara Capital",
    alternateName: "Fintara Loan Desk",
    url: "https://fintara-capital.vercel.app",
    logo: "https://fintara-capital.vercel.app/brand/mark.svg",
    image: "https://fintara-capital.vercel.app/brand/logo-horizontal.svg",
    description:
      "Pan-India loan facilitation desk and mortgage advisor partnering with 18+ leading banks and NBFCs. Doorstep processing and digital advisory for Home Loans, Loan Against Property (LAP), Business Loans, Personal Loans, and Balance Transfers.",
    telephone: "+91-98000-00001",
    email: "contact@fintara.capital",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pandri / Civil Lines Financial District",
      addressLocality: "Raipur",
      addressRegion: "Chhattisgarh",
      postalCode: "492001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 21.2514,
      longitude: 81.6296,
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "State", name: "Chhattisgarh" },
      { "@type": "City", name: "Raipur" },
      { "@type": "City", name: "Bhilai" },
      { "@type": "City", name: "Bilaspur" },
      { "@type": "City", name: "Durg" },
      { "@type": "City", name: "Nagpur" },
      { "@type": "City", name: "Mumbai" },
      { "@type": "City", name: "Delhi" },
      { "@type": "City", name: "Bengaluru" },
      { "@type": "City", name: "Hyderabad" },
    ],
    priceRange: "₹₹",
    openingHours: "Mo-Sa 09:30-19:00",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Loan Facilitation Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "Home Loans",
            description: "New purchase, construction, resale, and plot purchase home loans across 18+ banks.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "Loan Against Property (LAP)",
            description: "Mortgage loans unlocking property equity with high tenure and optimal LTV.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "Business Loans & Working Capital",
            description: "Secured and unsecured business loans, CC/OD limits, machinery finance, and GST-based limits.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "Personal Loans",
            description: "Fast-track unsecured personal financing for salaried professionals and business owners.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "Balance Transfer (Takeover)",
            description: "Refinance high-cost existing loans to lower rates and secure substantial EMI savings.",
          },
        },
      ],
    },
    sameAs: [
      "https://www.linkedin.com/company/fintara-capital",
      "https://github.com/akshayjhawar35-creator/fintara-capital",
    ],
  };

  const payload = data ? { "@context": "https://schema.org", "@type": type, ...data } : baseOrganization;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
