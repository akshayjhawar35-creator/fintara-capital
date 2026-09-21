import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
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
          <h1 className="font-serif text-2xl font-semibold text-midnight">Terms of Service</h1>
          <p>
            By using this website, you acknowledge that Fintara Capital acts solely as a loan facilitator and Direct Selling Agent (DSA) based in Raipur, Chhattisgarh.
          </p>
          <h2 className="font-semibold text-midnight text-sm pt-2">No Guarantee of Sanction</h2>
          <p>
            Loan sanctions, interest rates, processing charges, and disbursal timelines are determined solely by lending institutions (Banks, NBFCs, and HFCs) based on their internal credit policies.
          </p>
        </div>
      </section>
    </main>
  );
}
