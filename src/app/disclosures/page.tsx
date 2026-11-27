import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export const metadata = {
  title: "Statutory & Regulatory Disclosures | Fintara Capital",
  description:
    "Regulatory declarations, intermediary role, commission structure, and RBI compliance notice for Fintara Capital.",
};

export default function DisclosuresPage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <PublicHeader />

      <section className="py-12 md:py-16 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-5 text-xs sm:text-[13px] text-slate-600 leading-relaxed shadow-2xs">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
              Statutory &amp; Regulatory Disclosures
            </h1>
            <p className="text-xs text-slate-500">
              Fintara Capital &bull; Office No. 421, Walfort Omega, Raipur (C.G.)
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">1. Intermediary &amp; DSA Status</h2>
            <p>
              Fintara Capital operates strictly as an authorized Direct Selling Agent (DSA) and credit referral intermediary facilitating retail, mortgage, project finance, and working capital products across scheduled commercial banks, Housing Finance Companies (HFCs), and RBI-registered NBFCs. Fintara Capital does not function as a bank, NBFC, or deposit-taking entity.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">2. Remuneration &amp; Fee Transparency</h2>
            <p>
              Fintara Capital is compensated directly by empaneled lending institutions via standardized payout schedules upon successful loan disbursement. Borrowers are not charged upfront brokerage or hidden advisory fees by Fintara Capital.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">3. Lender Autonomy &amp; Sanction Terms</h2>
            <p>
              All credit underwriting, CIBIL pulls, property legal and technical valuations, Key Fact Statements (KFS), sanction letters, and loan agreements are issued directly by the partner bank or NBFC in compliance with Reserve Bank of India (RBI) Fair Practices Code and Digital Lending guidelines.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
