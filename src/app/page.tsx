import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-paper">
      {/* Header */}
      <header className="bg-white border-b border-slate/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/mark.svg"
              alt="Fintara Capital"
              width={40}
              height={40}
            />
            <span className="font-semibold text-midnight text-lg tracking-tight">
              Fintara<span className="font-normal text-slate ml-1">Capital</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login/"
              className="md:hidden bg-midnight text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-midnight/90 transition-colors"
            >
              Sign in
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate">
              <Link href="/about/" className="hover:text-teal transition-colors">About</Link>
              <Link href="/contact/" className="hover:text-teal transition-colors">Contact</Link>
              <Link
                href="/auth/login/"
                className="bg-midnight text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-midnight/90 transition-colors"
              >
                Sign in
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-midnight text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* Left — Message */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
              Loans, arranged across lenders.
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg">
              We compare options from 18+ banks and NBFCs to find the right loan for you.
              Home loans, business loans, balance transfers and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/apply/"
                className="bg-gold text-midnight font-semibold px-6 py-3 rounded-md hover:bg-gold/90 transition-colors"
              >
                Check your eligibility
              </Link>
              <Link
                href="/calculators/emi/"
                className="border border-white/30 text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors"
              >
                EMI calculator
              </Link>
            </div>
          </div>

          {/* Right — BT Calculator Placeholder */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
            <h2 className="font-semibold text-lg mb-4">What could you save?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Current loan amount</label>
                <input
                  type="text"
                  placeholder="₹55,00,000"
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Current interest rate</label>
                <input
                  type="text"
                  placeholder="9.35%"
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Remaining years</label>
                <input
                  type="text"
                  placeholder="15"
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  readOnly
                />
              </div>
              <div className="bg-gold/10 border border-gold/30 rounded-md p-4 mt-2">
                <p className="text-sm text-white/70">Estimated yearly saving</p>
                <p className="text-2xl font-semibold text-gold tabular-nums">₹52,250 *</p>
              </div>
              <Link
                href="/apply/"
                className="block w-full text-center bg-gold text-midnight font-semibold py-3 rounded-md hover:bg-gold/90 transition-colors"
              >
                Get a free review
              </Link>
            </div>
            <p className="text-xs text-white/50 mt-3">
              * Indicative. Subject to lender approval, eligibility and charges.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-midnight mb-10 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Tell us what you need", desc: "Share your loan requirement — amount, purpose, timeline. We listen, we don't push." },
              { step: "2", title: "We find options", desc: "We compare offers from multiple banks and NBFCs based on your profile and eligibility." },
              { step: "3", title: "You choose", desc: "Pick the option that works for you. We handle the paperwork and follow up until disbursal." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-midnight text-white font-semibold text-sm mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-midnight text-lg mb-2">{title}</h3>
                <p className="text-slate text-sm max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-midnight mb-6">
            Products
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Home Loan", "Loan Against Property", "Business Loan",
              "Working Capital", "Personal Loan", "Car Loan",
              "Education Loan", "Gold Loan", "Machinery Loan",
              "Credit Card", "Insurance",
            ].map((product) => (
              <span
                key={product}
                className="inline-block bg-white border border-slate/10 rounded-md px-3 py-1.5 text-sm text-midnight"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Lenders */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-midnight mb-4">
            Lenders we work with
          </h2>
          <p className="text-slate text-sm mb-6">Listed alphabetically. We are a loan facilitator, not a lender.</p>
          <p className="text-sm text-midnight leading-relaxed">
            Aadhar Housing Finance · Aavas Financiers · Aditya Birla Capital ·
            Axis Bank · Bajaj Finance · Bank of Baroda · Cholamandalam Finance ·
            HDFC Bank · ICICI Bank · IDFC First Bank · Kotak Mahindra Bank ·
            L&T Finance · Piramal Finance · Poonawalla Fincorp ·
            Punjab National Bank · State Bank of India · Tata Capital ·
            Union Bank of India
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-midnight text-white/70 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <p className="text-white font-semibold mb-2">Fintara Capital</p>
              <p>Loans, arranged across lenders.</p>
              <p className="mt-2">Raipur, Chhattisgarh, India</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Products</p>
              <div className="space-y-1">
                <Link href="/loans/home-loan/" className="block hover:text-gold">Home Loan</Link>
                <Link href="/loans/loan-against-property/" className="block hover:text-gold">Loan Against Property</Link>
                <Link href="/loans/business-loan/" className="block hover:text-gold">Business Loan</Link>
                <Link href="/balance-transfer/" className="block hover:text-gold">Balance Transfer</Link>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Tools</p>
              <div className="space-y-1">
                <Link href="/calculators/emi/" className="block hover:text-gold">EMI Calculator</Link>
                <Link href="/calculators/eligibility/" className="block hover:text-gold">Eligibility Calculator</Link>
                <Link href="/apply/" className="block hover:text-gold">Apply Now</Link>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Legal</p>
              <div className="space-y-1">
                <Link href="/privacy/" className="block hover:text-gold">Privacy Policy</Link>
                <Link href="/terms/" className="block hover:text-gold">Terms</Link>
                <Link href="/disclosures/" className="block hover:text-gold">Disclosures</Link>
                <Link href="/grievance/" className="block hover:text-gold">Grievance</Link>
                <Link href="/auth/login/" className="block hover:text-gold text-gold font-medium">Staff Portal &rarr;</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-xs text-white/40">
            <p>© {new Date().getFullYear()} Fintara Capital. All rights reserved.</p>
            <p className="mt-1">
              Fintara Capital is a loan facilitator / DSA (Direct Selling Agent), not a lender.
              All loans are disbursed by the respective banks and NBFCs.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
