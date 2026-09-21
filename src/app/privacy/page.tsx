import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-paper">
      <header className="bg-white border-b border-slate/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/mark.svg" alt="Fintara Capital" width={36} height={36} />
            <span className="font-semibold text-midnight text-lg tracking-tight">
              Fintara<span className="font-normal text-slate ml-1">Capital</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate">
            <Link href="/" className="hover:text-teal">Home</Link>
            <Link href="/auth/login/" className="bg-midnight text-white px-3.5 py-1.5 rounded-md font-medium">Sign in</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-surface p-8 rounded-2xl border border-slate/15 space-y-4 text-xs text-slate leading-relaxed">
          <h1 className="font-serif text-2xl font-semibold text-midnight">Privacy Policy &amp; DPDP Notice</h1>
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
            You have the right to withdraw your consent at any time. To request consent withdrawal or data deletion, contact our Grievance Officer at contact@fintara.capital.
          </p>
        </div>
      </section>
    </main>
  );
}
