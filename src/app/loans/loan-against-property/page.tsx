import Link from "next/link";
import Image from "next/image";

export default function LAPPage() {
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
          <h1 className="font-serif text-3xl font-semibold text-midnight">Loan Against Property (LAP)</h1>
          <p className="text-slate leading-relaxed">
            Unlock the market value of your residential, commercial, or industrial property in Raipur with high-ticket mortgage loans. Suitable for business expansion, debt consolidation, or working capital.
          </p>
          <div className="p-6 bg-surface rounded-2xl border border-slate/15 space-y-3">
            <div className="font-semibold text-midnight">Indicative Benchmark: ~9.75% p.a.</div>
            <p className="text-xs text-slate">Tenures up to 15 years. Loan amounts up to ₹10 Crore depending on title deed verification and property valuation.</p>
            <Link href="/apply/" className="inline-block px-5 py-2.5 bg-midnight text-white text-xs font-semibold rounded-md hover:bg-midnight/90">
              Apply for LAP &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
