import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export default function GrievancePage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <PublicHeader />

      <section className="py-12 md:py-16 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-surface p-8 rounded-2xl border border-slate/15 space-y-4 text-xs text-slate leading-relaxed shadow-xs">
          <h1 className="font-serif text-2xl font-bold text-midnight">Grievance Redressal Mechanism</h1>
          <p>
            In compliance with RBI guidelines on Fair Practices and Digital Lending, Fintara Capital maintains a formal, transparent customer grievance redressal process for all loan facilitation services.
          </p>

          <div className="p-5 bg-paper rounded-2xl border border-slate/15 space-y-2.5">
            <h2 className="font-bold text-midnight text-sm">Grievance Redressal Officer</h2>
            <p><strong>Name:</strong> Senior Compliance Officer, Fintara Capital</p>
            <p><strong>HQ Address:</strong> Civil Lines / Pandri, Raipur, Chhattisgarh &ndash; 492001, India</p>
            <p><strong>Email:</strong> grievance@fintara.capital / contact@fintara.capital</p>
            <p><strong>Direct Helpline:</strong> +91 98261 00000</p>
            <p><strong>Resolution SLA / TAT:</strong> 7 business days from receipt of grievance</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
