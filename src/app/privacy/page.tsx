import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export const metadata = {
  title: "Privacy Policy & DPDP Act 2023 Notice | Fintara Capital",
  description:
    "How Fintara Capital collects, processes, and protects borrower contact information under the Digital Personal Data Protection (DPDP) Act 2023.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <PublicHeader />

      <section className="py-12 md:py-16 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-5 text-xs sm:text-[13px] text-slate-600 leading-relaxed shadow-2xs">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
              Privacy Policy &amp; DPDP Notice
            </h1>
            <p className="text-xs text-slate-500">
              Compliant with the Digital Personal Data Protection (DPDP) Act, 2023
            </p>
          </div>

          <p>
            <strong>Fintara Capital</strong> (<strong>Office No. 421, Walfort Omega, Raipur (C.G.)</strong>) respects borrower privacy and processes personal information strictly on the basis of affirmative consent for loan facilitation.
          </p>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">1. Information We Collect</h2>
            <p>
              When you submit an enquiry on <strong>fintara.capital</strong>, we collect only basic contact and requirement metadata (full name, 10-digit mobile number, city, employment category, and desired loan amount/product) strictly to assess preliminary eligibility and respond to your request.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">2. Data Minimization &amp; KYC Non-Storage</h2>
            <p>
              We enforce strict data minimization: this web platform never asks for or stores raw Aadhaar numbers, PAN numbers, OTPs, or net-banking passwords in web forms or databases. Official KYC and financial verification documents are coordinated securely only with the specific lending institution you explicitly authorize.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">3. Zero Unauthorized Lead Sharing</h2>
            <p>
              We do not sell, rent, or distribute your phone number or financial profile to third-party telemarketing networks or lead aggregators. Your details are used exclusively for processing your requested loan mandate.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">4. Your Rights Under the DPDP Act, 2023</h2>
            <p>
              As a Data Principal, you retain the right to access, correct, or request deletion of your personal contact record, as well as withdraw consent at any time. To exercise these rights, write to our Data Protection &amp; Grievance Desk at <strong>fintaracapital@gmail.com</strong> or call <strong>+91 95893 52662</strong>.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
