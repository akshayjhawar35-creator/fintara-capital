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
    alternateName: "Fintara Institutional Debt Advisory",
    url: "https://fintara.capital",
    logo: "https://fintara.capital/brand/mark.svg",
    image: "https://fintara.capital/brand/logo-horizontal.svg",
    description:
      "Pan-India institutional loan advisory desk and mortgage advisor partnering with 18+ leading national banks and NBFCs. Doorstep processing and digital advisory for Home Loans, Loan Against Property (LAP), Business Loans, Personal Loans, and Balance Transfers with zero borrower fees.",
    telephone: "+91-95893-52662",
    email: "fintaracapital@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office No. 421, Walfort Omega",
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
      { "@type": "City", name: "Indore" },
    ],
    priceRange: "₹₹",
    openingHours: "Mo-Sa 09:30-19:00",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Institutional Debt Facilitation Services",
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
            description: "Commercial & residential mortgage loans unlocking property equity with high tenure and optimal LTV.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "New Project Loans & Capex Finance",
            description: "Term finance for industrial expansion, warehouses, hospitals, and machinery.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "Working Capital Limits (Secured & Unsecured)",
            description: "Secured CC, Overdraft, Drop-line OD, Bank Guarantees, and collateral-free business lines.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "Business Loans & Personal Loans",
            description: "Collateral-free SME business loans and personal financing for salaried professionals.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "FinancialProduct",
            name: "Loan Balance Transfer (Takeover)",
            description: "Refinance high-cost existing loans to lower rates and secure substantial EMI savings.",
          },
        },
      ],
    },
    sameAs: [
      "https://www.linkedin.com/company/fintara-capital",
      "https://x.com/fintaracapital",
      "https://instagram.com/fintara.capital",
      "https://youtube.com/@fintaracapital",
      "https://wa.me/919589352662",
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
