import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <PublicHeader />

      <section className="py-12 md:py-16 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-surface p-8 rounded-2xl border border-slate/15 space-y-4 text-xs text-slate leading-relaxed shadow-xs">
          <h1 className="font-serif text-2xl font-bold text-midnight">Privacy Policy &amp; DPDP Notice</h1>
          <p>
            Fintara Capital (&quot;we&quot;, &quot;us&quot;) is committed to protecting your personal data in accordance with the Digital Personal Data Protection (DPDP) Act 2023 and RBI Digital Lending Directions.
          </p>
          <h2 className="font-semibold text-midnight text-sm pt-2">1. Data We Collect</h2>
          <p>
            We collect personal identification and contact details (name, phone number, email address, property/employment type) solely for evaluating loan eligibility and coordinating with our empaneled lending partners.
          </p>
          <h2 className="font-semibold text-midnight text-sm pt-2">2. Strict KYC Non-Storage Principle</h2>
          <p>
            Per internal security policy A9, Fintara Capital does not store sensitive government identification numbers (Aadhaar, PAN) or bank account credentials on our web platform.
          </p>
          <h2 className="font-semibold text-midnight text-sm pt-2">3. Right to Withdraw Consent</h2>
          <p>
            You have the right to withdraw your consent at any time. To request consent withdrawal or data deletion, contact our Grievance Officer at fintaracapital@gmail.com.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
