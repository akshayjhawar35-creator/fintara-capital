import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export const metadata = {
  title: "Terms of Service | Fintara Capital",
  description:
    "Terms of Service governing access to Fintara Capital (fintara.capital), loan advisory scope, lender autonomy, and jurisdiction.",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <PublicHeader />

      <section className="py-12 md:py-16 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-5 text-xs sm:text-[13px] text-slate-600 leading-relaxed shadow-2xs">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-500">
              Effective Date: November 2026 &bull; Applicable to fintara.capital
            </p>
          </div>

          <p>
            Welcome to <strong>Fintara Capital</strong> (accessible at <strong>https://fintara.capital</strong>), operating from <strong>Office No. 421, Walfort Omega, Raipur (C.G.)</strong>. By accessing this website, submitting an enquiry, or using our calculators, you agree to be bound by these Terms of Service.
          </p>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">1. Role &amp; Scope of Service</h2>
            <p>
              Fintara Capital operates solely as an independent loan facilitator, credit intermediary, and Direct Selling Agent (DSA) collaborating with scheduled commercial banks, Housing Finance Companies (HFCs), and RBI-registered NBFCs. We are not a bank, NBFC, or direct lender, and we do not accept public deposits or disburse loans from our own balance sheet.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">2. No Guarantee of Sanction or Specific Rates</h2>
            <p>
              Any interest rates, EMI calculations, LTV projections, or turnaround estimates shown on this website are purely indicative benchmarks for informational purposes. Final credit appraisal, loan sanction, interest rate determination, processing charges, property valuation, and disbursement schedules remain strictly at the discretion of the respective lending institutions under their underwriting policies and Reserve Bank of India (RBI) guidelines.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">3. Zero Borrower Advisory Fee Policy</h2>
            <p>
              Fintara Capital does not charge retail or MSME loan applicants any upfront consultation fee, login fee, or file-handling fee. We receive referral remuneration directly from empaneled lending partners upon successful loan disbursement. Note that statutory charges (stamp duty, CERSAI, legal search, technical valuation, or bank processing fees) payable directly to the lending bank or government authorities are borne by the borrower as per lender terms.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">4. User Obligations &amp; Accuracy of Information</h2>
            <p>
              By submitting a loan requirement, you confirm that all personal, financial, GST, ITR, and property details shared with our advisory desk are true, complete, and authentic. Misrepresentation or submission of forged documents will result in immediate termination of facilitation and may be reported to concerned institutions as required by law.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">5. Limitation of Liability &amp; Third-Party Links</h2>
            <p>
              To the maximum extent permitted by applicable Indian law, Fintara Capital shall not be liable for any indirect, incidental, or consequential damages arising from loan delays, valuation shortfalls, rejection of applications by partner lenders, or downtime of third-party bank portals.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">6. Intellectual Property</h2>
            <p>
              All trademarks, brand marks, visual layouts, checklists, guides, and software workflows published on <strong>fintara.capital</strong> belong to Fintara Capital and may not be reproduced commercially without prior written consent.
            </p>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-bold text-midnight text-sm">7. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms of Service are governed by the laws of the Republic of India. Any dispute arising out of or in connection with our advisory services or website shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Raipur, Chhattisgarh, India</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <strong className="text-midnight block">Contact for Legal Notices</strong>
            <p>Fintara Capital &bull; Office No. 421, Walfort Omega, Raipur (C.G.)</p>
            <p>Email: fintaracapital@gmail.com &bull; Phone: +91 95893 52662</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
