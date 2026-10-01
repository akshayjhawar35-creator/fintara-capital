import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export default function DisclosuresPage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <PublicHeader />

      <section className="py-12 md:py-16 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-surface p-8 rounded-2xl border border-slate/15 space-y-4 text-xs text-slate leading-relaxed shadow-xs">
          <h1 className="font-serif text-2xl font-bold text-midnight">Regulatory Disclosures</h1>
          <p>
            Fintara Capital operates as an independent loan referral and sourcing agent (Direct Selling Agent) facilitating credit products across scheduled commercial banks and RBI-registered NBFCs.
          </p>
          <h2 className="font-semibold text-midnight text-sm pt-2">Commission &amp; Remuneration</h2>
          <p>
            Fintara Capital receives referral commissions directly from empaneled lenders upon successful loan disbursal. We do not charge borrowers upfront cash fees or secret broker charges.
          </p>
          <h2 className="font-semibold text-midnight text-sm pt-2">Lender Decision Autonomy</h2>
          <p>
            All credit appraisals, property legal verifications, technical inspections, sanction letters, and loan agreement covenants are issued directly by partner banks and NBFCs in accordance with their regulatory mandates.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
