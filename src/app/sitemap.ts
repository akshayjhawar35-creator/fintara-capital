import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fintara-capital.vercel.app";

  const routes = [
    "",
    "/about/",
    "/contact/",
    "/apply/",
    "/balance-transfer/",
    "/calculators/emi/",
    "/calculators/eligibility/",
    "/loans/home-loan/",
    "/loans/loan-against-property/",
    "/loans/business-loan/",
    "/privacy/",
    "/terms/",
    "/disclosures/",
    "/grievance/",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route.startsWith("/loans") || route.startsWith("/calculators") || route === "/apply/" ? 0.8 : 0.5,
  }));
}
