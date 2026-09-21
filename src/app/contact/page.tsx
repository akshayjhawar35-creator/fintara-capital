import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
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
            <Link href="/about/" className="hover:text-teal">About</Link>
            <Link href="/auth/login/" className="bg-midnight text-white px-3.5 py-1.5 rounded-md font-medium">Sign in</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto bg-surface p-8 rounded-2xl border border-slate/15 shadow-xs space-y-6">
          <h1 className="font-serif text-2xl font-semibold text-midnight">Contact Us</h1>
          <p className="text-xs text-slate">
            Reach out for loan inquiries, balance transfer consultations, or partnership queries.
          </p>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" />
              <div>
                <strong className="text-midnight block">Office Address</strong>
                <span className="text-slate">Raipur, Chhattisgarh, 492001, India</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-teal shrink-0 mt-0.5" />
              <div>
                <strong className="text-midnight block">Email Address</strong>
                <span className="text-slate">contact@fintara.capital</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-teal shrink-0 mt-0.5" />
              <div>
                <strong className="text-midnight block">Helpline / WhatsApp</strong>
                <span className="text-slate">+91 98000 00011</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
