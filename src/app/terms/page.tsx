import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <PublicHeader />

      <section className="py-12 md:py-16 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-surface p-8 rounded-2xl border border-slate/15 space-y-4 text-xs text-slate leading-relaxed shadow-xs">
          <h1 className="font-serif text-2xl font-bold text-midnight">Terms of Service</h1>
          <p>
            By using this website, you acknowledge that Fintara Capital acts solely as an authorized loan facilitator and Direct Selling Agent (DSA) based in Raipur, Chhattisgarh, serving borrowers nationwide.
          </p>
          <h2 className="font-semibold text-midnight text-sm pt-2">No Guarantee of Sanction</h2>
          <p>
            Loan sanctions, interest rates, processing charges, and disbursal timelines are determined solely by institutional lending partners (Banks, NBFCs, and HFCs) based on their internal underwriting standards and credit policies.
          </p>
          <h2 className="font-semibold text-midnight text-sm pt-2">Zero Fee Advisory</h2>
          <p>
            Fintara Capital does not charge borrowers any upfront advisory or processing charges. Our services are compensated directly by empaneled lending institutions upon successful loan disbursals.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
