"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { useData } from "@/lib/data/store";
import { formatINR } from "@/lib/format";
import { isSafeText } from "@/lib/sensitive-guard";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const { addLead, today } = useData();

  const [submittedLeadCode, setSubmittedLeadCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    cityArea: "Pandri, Raipur",
    loanType: "Home Loan",
    amount: "4500000",
    employmentType: "Salaried Professional",
    notes: "",
    consent: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate 10-digit mobile
    const cleanMobile = formData.mobile.replace(/[\s\-\+]/g, "");
    if (!/^\d{10}$/.test(cleanMobile.slice(-10))) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    // Sensitive data guard (No PAN/Aadhaar in notes)
    if (formData.notes && !isSafeText(formData.notes)) {
      setErrorMsg(
        "This looks like a PAN or Aadhaar number. Please do not store it here — our advisor will collect document copies directly."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate 24-hour follow-up date
      const d = new Date(today);
      d.setDate(d.getDate() + 1);
      const nextFollowup = d.toISOString().split("T")[0];

      const newLead = addLead({
        name: formData.name.trim(),
        mobile: cleanMobile.slice(-10),
        location_area: formData.cityArea,
        product_id:
          formData.loanType === "Home Loan"
            ? "p-hl"
            : formData.loanType === "Loan Against Property"
            ? "p-lap"
            : formData.loanType === "Personal Loan"
            ? "p-pl"
            : "p-bl",
        product_name: formData.loanType,
        amount: Number(formData.amount),
        source: "Website Contact & Enquiry Desk",
        status: "New",
        assigned_to: "Staff 1",
        assigned_to_id: "usr-staff1",
        last_contact_on: null,
        next_followup_on: nextFollowup,
        notes: `[Online Enquiry - ${formData.employmentType}]: ${
          formData.notes.trim() || "Interested in competitive loan structuring."
        }`,
      });

      setSubmittedLeadCode(newLead.lead_code);
    } catch {
      setErrorMsg("An error occurred while submitting your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-paper flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 py-10 md:py-14 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header Title Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald" />
              Direct Customer Enquiry &amp; Loan Facilitation Desk
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-midnight tracking-tight">
              Contact Our Desk &amp; Submit Your Loan Enquiry
            </h1>
            <p className="text-slate text-xs sm:text-sm leading-relaxed">
              Whether you need a new Home Loan, high-ticket LAP, collateral-free Business Loan, or a Balance Transfer to reduce your existing EMI &mdash; our Raipur advisory desk provides neutral comparisons across 18+ lenders with zero upfront fees.
            </p>
          </div>

          {/* Two-Column Responsive Layout */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Office & Direct Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              {/* Raipur HQ Card */}
              <div className="bg-surface rounded-2xl p-6 border border-slate/15 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-midnight text-white flex items-center justify-center font-bold shadow-xs">
                    <Building2 className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base font-bold text-midnight">
                      Raipur National Headquarters
                    </h2>
                    <span className="text-[11px] text-slate">
                      Fintara Capital Private Desk
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-midnight block font-semibold">Office Address</strong>
                      <span className="text-slate leading-relaxed">
                        Fintara Capital, Civil Lines / Pandri Financial Hub, Raipur, Chhattisgarh &ndash; 492001, India.
                      </span>
                      <span className="block text-[11px] text-emerald font-medium mt-0.5">
                        Landmark: Near Devendra Nagar &amp; City Center Mall
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-midnight block font-semibold">Desk Helpline &amp; WhatsApp</strong>
                      <span className="text-slate font-mono">+91 98261 00000 &bull; +91 98261 00001</span>
                      <span className="block text-[11px] text-slate-light mt-0.5">
                        Direct loan advisory &amp; eligibility assessment
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-midnight block font-semibold">Official Email</strong>
                      <span className="text-slate font-mono">contact@fintara.capital</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-midnight block font-semibold">Working Hours</strong>
                      <span className="text-slate">
                        Monday &ndash; Saturday: 9:30 AM to 7:00 PM IST
                      </span>
                      <span className="block text-[11px] text-slate-light">
                        Closed on Sundays &amp; National Bank Holidays
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp CTA Button */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/919826100000?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan%20for%20my%20requirement."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                  <p className="text-[10px] text-slate text-center mt-1.5">
                    Average response time: Under 15 minutes during desk hours
                  </p>
                </div>
              </div>

              {/* Service Commitments Card */}
              <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-xs space-y-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate block">
                  Our Service Guarantees
                </span>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-midnight block">Zero Fee to Borrowers:</strong>
                      <span className="text-slate">Our advisory, document pickup, and bank liaisoning are 100% complimentary.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-midnight block">No Unsolicited Spams:</strong>
                      <span className="text-slate">Under the DPDP Act 2023, your contact info is only used to structure your requested loan.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-midnight block">Multi-Lender Access:</strong>
                      <span className="text-slate">Direct tie-ups with SBI, HDFC, ICICI, Kotak, Axis, Bajaj, Tata Capital, and 11+ more.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Loan Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-slate/15 shadow-sm space-y-6">
                {submittedLeadCode ? (
                  <div className="text-center py-8 space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald flex items-center justify-center mx-auto border border-emerald-200">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="inline-block px-3.5 py-1 rounded-full bg-paper border border-slate/20 font-mono text-xs font-bold text-midnight shadow-2xs">
                      Enquiry Reference ID: {submittedLeadCode}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-midnight">
                      Enquiry Received, {formData.name}!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate max-w-md mx-auto leading-relaxed">
                      Your loan requirement for <strong className="text-midnight">{formData.loanType}</strong> ({formatINR(Number(formData.amount))}) has been logged in our Raipur desk. A loan officer will call you on <strong className="text-midnight">+91 {formData.mobile}</strong> within 24 hours.
                    </p>

                    <div className="p-4 bg-paper rounded-2xl border border-slate/15 text-xs text-slate text-left space-y-2">
                      <span className="font-bold text-midnight block text-sm">
                        What Happens Next?
                      </span>
                      <div className="space-y-1 text-slate">
                        <p>1. <strong>Pre-Underwriting Review:</strong> We analyze your eligibility against bank cut-offs.</p>
                        <p>2. <strong>Institutional Match:</strong> We present the 3 best bank &amp; NBFC offers suited for your profile.</p>
                        <p>3. <strong>Doorstep Service:</strong> Zero visits to bank branches; our officer coordinates document pickup.</p>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedLeadCode(null);
                          setFormData({
                            name: "",
                            mobile: "",
                            cityArea: "Pandri, Raipur",
                            loanType: "Home Loan",
                            amount: "4500000",
                            employmentType: "Salaried Professional",
                            notes: "",
                            consent: true,
                          });
                        }}
                        className="px-5 py-2.5 bg-paper hover:bg-slate/10 text-midnight text-xs font-semibold rounded-xl border border-slate/20 transition-colors"
                      >
                        Submit Another Enquiry
                      </button>
                      <Link
                        href="/"
                        className="px-5 py-2.5 bg-midnight text-white text-xs font-bold rounded-xl hover:bg-midnight/90 transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>Back to Homepage</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald/10 text-emerald text-[10px] font-bold uppercase tracking-wider mb-2">
                        Fast-Track Application
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-midnight">
                        Online Loan Enquiry Form
                      </h2>
                      <p className="text-xs text-slate mt-0.5">
                        Fill out your loan requirement below for instant evaluation by our senior credit underwriters.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-crimson/10 border border-crimson/20 text-crimson text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Applicant Name & Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-midnight mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alok Verma"
                          value={formData.name}
                          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                          className="w-full px-3.5 py-2.5 text-xs border border-slate/20 rounded-xl bg-paper focus:bg-white focus:outline-emerald font-medium min-h-[44px]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-midnight mb-1.5">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={formData.mobile}
                          onChange={(e) => setFormData((p) => ({ ...p, mobile: e.target.value }))}
                          className="w-full px-3.5 py-2.5 text-xs border border-slate/20 rounded-xl bg-paper focus:bg-white focus:outline-emerald font-mono font-medium min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* Loan Requirement & Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-midnight mb-1.5">
                          Loan Product Type
                        </label>
                        <select
                          value={formData.loanType}
                          onChange={(e) => setFormData((p) => ({ ...p, loanType: e.target.value }))}
                          className="w-full px-3.5 py-2.5 text-xs border border-slate/20 rounded-xl bg-paper focus:bg-white focus:outline-emerald font-medium min-h-[44px]"
                        >
                          <option value="Home Loan">Home Loan (Purchase / Construction)</option>
                          <option value="Loan Against Property">Loan Against Property (LAP)</option>
                          <option value="Business Loan">Unsecured Business Loan</option>
                          <option value="Personal Loan">Personal Loan</option>
                          <option value="Balance Transfer">Balance Transfer &amp; Top-up</option>
                          <option value="Working Capital (OD/CC)">Working Capital (OD / CC Limit)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-midnight mb-1.5">
                          Raipur Area / City
                        </label>
                        <select
                          value={formData.cityArea}
                          onChange={(e) => setFormData((p) => ({ ...p, cityArea: e.target.value }))}
                          className="w-full px-3.5 py-2.5 text-xs border border-slate/20 rounded-xl bg-paper focus:bg-white focus:outline-emerald font-medium min-h-[44px]"
                        >
                          <option value="Pandri, Raipur">Pandri (Raipur)</option>
                          <option value="Shankar Nagar, Raipur">Shankar Nagar (Raipur)</option>
                          <option value="Telibandha, Raipur">Telibandha (Raipur)</option>
                          <option value="Devendra Nagar, Raipur">Devendra Nagar (Raipur)</option>
                          <option value="Civil Lines, Raipur">Civil Lines (Raipur)</option>
                          <option value="Tatibandh, Raipur">Tatibandh (Raipur)</option>
                          <option value="Bhilai / Durg">Bhilai / Durg</option>
                          <option value="Bilaspur">Bilaspur (C.G.)</option>
                          <option value="Other Chhattisgarh">Other Chhattisgarh</option>
                          <option value="Metro City / Pan-India">Metro City / Pan-India</option>
                        </select>
                      </div>
                    </div>

                    {/* Employment Type */}
                    <div>
                      <label className="block font-bold text-midnight mb-1.5">
                        Applicant Profile / Employment Type
                      </label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => setFormData((p) => ({ ...p, employmentType: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate/20 rounded-xl bg-paper focus:bg-white focus:outline-emerald font-medium min-h-[44px]"
                      >
                        <option value="Salaried Professional">Salaried (Corporate / MNC / Govt)</option>
                        <option value="Self-Employed Business / Trader">Self-Employed Business / Retail Trader</option>
                        <option value="Practicing Professional (Doctor/CA/Lawyer)">Practicing Professional (Doctor, CA, Architect)</option>
                        <option value="MSME Manufacturing / Industrialist">MSME Manufacturing / Industrialist</option>
                      </select>
                    </div>

                    {/* Loan Amount Slider */}
                    <div className="bg-paper p-4 rounded-2xl border border-slate/15 space-y-2">
                      <div className="flex justify-between items-center font-bold text-midnight">
                        <span>Required Loan Amount</span>
                        <span className="font-mono text-sm text-emerald">
                          {formatINR(Number(formData.amount))}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="500000"
                        max="100000000"
                        step="500000"
                        value={formData.amount}
                        onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                        className="w-full accent-emerald cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-slate">
                        <span>₹5 Lakhs</span>
                        <span>₹25 Lakhs</span>
                        <span>₹1 Crore</span>
                        <span>₹10 Crores</span>
                      </div>
                    </div>

                    {/* Optional Notes */}
                    <div>
                      <label className="block font-bold text-midnight mb-1.5">
                        Specific Requirements / Existing Loans (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Existing bank, property market value, balance transfer requirement..."
                        value={formData.notes}
                        onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate/20 rounded-xl bg-paper focus:bg-white focus:outline-emerald"
                      />
                    </div>

                    {/* DPDP Consent */}
                    <div>
                      <label className="flex items-start gap-2.5 text-[11px] text-slate cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={(e) => setFormData((p) => ({ ...p, consent: e.target.checked }))}
                          className="mt-0.5 accent-emerald"
                        />
                        <span className="leading-relaxed">
                          I consent to Fintara Capital contacting me regarding loan facilitation under the Digital Personal Data Protection (DPDP) Act 2023. I understand no sensitive KYC data (Aadhaar/PAN) is stored online.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-midnight hover:bg-midnight/90 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 min-h-[44px] active:scale-98"
                    >
                      <span>Submit Loan Enquiry to Raipur Desk</span>
                      <ArrowRight className="w-4 h-4 text-gold" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
