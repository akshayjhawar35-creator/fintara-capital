import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
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
            <Link href="/contact/" className="hover:text-teal">Contact</Link>
            <Link href="/auth/login/" className="bg-midnight text-white px-3.5 py-1.5 rounded-md font-medium">Sign in</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="font-serif text-3xl font-semibold text-midnight">About Fintara Capital</h1>
          <p className="text-slate leading-relaxed">
            Fintara Capital is a loan facilitation firm based in Raipur, Chhattisgarh. We act as Direct Selling Agents (DSA) partnering with over 18 leading banks, NBFCs, and housing finance companies across India.
          </p>
          <p className="text-slate leading-relaxed">
            Our mission is simple: provide borrowers with transparent, unbiased comparison across lenders for home loans, balance transfers, business loans, and loan against property. We handle paperwork, documentation, and follow-ups with bank relationship managers from login through disbursal.
          </p>
          <div className="p-4 bg-white rounded-xl border border-slate/15 space-y-2 text-xs text-slate">
            <div className="font-semibold text-midnight text-sm">Regulatory Notice</div>
            <p>
              Fintara Capital is a loan facilitator and credit advisory intermediary, not a bank or lender. All loan sanctions, interest rates, and disbursals are solely at the discretion of the financing institutions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
