import Link from "next/link";
import Image from "next/image";

export default function GrievancePage() {
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
          <h1 className="font-serif text-2xl font-semibold text-midnight">Grievance Redressal Mechanism</h1>
          <p>
            In compliance with Digital Lending guidelines, Fintara Capital maintains a formal customer grievance redressal process.
          </p>

          <div className="p-4 bg-paper rounded-xl border border-slate/15 space-y-2">
            <h2 className="font-semibold text-midnight text-sm">Grievance Redressal Officer</h2>
            <p><strong>Name:</strong> Grievance Officer, Fintara Capital</p>
            <p><strong>Address:</strong> Raipur, Chhattisgarh, India</p>
            <p><strong>Email:</strong> grievance@fintara.capital</p>
            <p><strong>Resolution TAT:</strong> 7 business days</p>
          </div>
        </div>
      </section>
    </main>
  );
}
