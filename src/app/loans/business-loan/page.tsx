import Link from "next/link";
import Image from "next/image";

export default function BusinessLoanPage() {
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
            <Link href="/calculators/emi/" className="hover:text-teal">EMI Calculator</Link>
            <Link href="/auth/login/" className="bg-midnight text-white px-3.5 py-1.5 rounded-md font-medium">Sign in</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="font-serif text-3xl font-semibold text-midnight">Business &amp; MSME Loans</h1>
          <p className="text-slate leading-relaxed">
            Unsecured and secured business financing for traders, manufacturers, and service enterprises in Chhattisgarh. Quick processing based on 1–3 years ITR, GST turnover, and bank account banking conduct.
          </p>
          <div className="p-6 bg-surface rounded-2xl border border-slate/15 space-y-3">
            <div className="font-semibold text-midnight">Indicative Benchmark: ~14.00% p.a.</div>
            <p className="text-xs text-slate">Collateral-free up to ₹50 Lakhs. Turnaround within 5 to 7 business days.</p>
            <Link href="/apply/" className="inline-block px-5 py-2.5 bg-midnight text-white text-xs font-semibold rounded-md hover:bg-midnight/90">
              Apply for Business Loan &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
