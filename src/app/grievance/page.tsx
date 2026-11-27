import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export const metadata = {
  title: "Grievance Redressal Mechanism | Fintara Capital",
  description:
    "Contact Fintara Capital's Grievance Redressal Officer for customer support, service feedback, or data protection requests.",
};

export default function GrievancePage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <PublicHeader />

      <section className="py-12 md:py-16 px-4 flex-1">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-5 text-xs sm:text-[13px] text-slate-600 leading-relaxed shadow-2xs">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
            Grievance Redressal Mechanism
          </h1>
          <p>
            In alignment with RBI Fair Practices guidelines and the DPDP Act 2023, Fintara Capital maintains a transparent, accountable customer grievance redressal desk for all loan facilitation inquiries.
          </p>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <h2 className="font-bold text-midnight text-sm">Designated Grievance Officer</h2>
            <p><strong>Office:</strong> Fintara Capital, Office No. 421, Walfort Omega, Raipur (C.G.), India</p>
            <p><strong>Official Email:</strong> fintaracapital@gmail.com</p>
            <p><strong>Direct Helpline:</strong> +91 95893 52662 (Monday – Saturday, 9:30 AM to 7:00 PM IST)</p>
            <p><strong>Resolution Turnaround:</strong> Within 7 business days from receipt of written grievance</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
