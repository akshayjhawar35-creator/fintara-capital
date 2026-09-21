"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useData } from "@/lib/data/store";
import {
  WHATSAPP_TEMPLATES,
  buildWhatsAppMessage,
  BuildMessageParams,
} from "@/lib/whatsapp";
import {
  MessageCircle,
  Shield,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Copy,
  X,
} from "lucide-react";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  mobile: string;
  consent: boolean;
  clientId?: string;
  linkedCaseCode?: string;
  linkedLoanCode?: string;
  initialTemplateId?: string;
  product?: string;
  stagePlain?: string;
  pendingDocs?: string;
  expectedDate?: string;
  currentRoi?: string;
  estSaving?: string;
  onLogged?: () => void;
}

export default function WhatsAppModal({
  isOpen,
  onClose,
  clientName,
  mobile,
  consent,
  clientId,
  linkedCaseCode,
  linkedLoanCode,
  initialTemplateId = "t10_gentle_followup",
  product,
  stagePlain,
  pendingDocs,
  expectedDate,
  currentRoi,
  estSaving,
  onLogged,
}: WhatsAppModalProps) {
  const { profile } = useAuth();
  const { addContactLog, today } = useData();

  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const [copied, setCopied] = useState(false);
  const [markedSent, setMarkedSent] = useState(false);

  const messageResult = useMemo(() => {
    return buildWhatsAppMessage({
      templateId: selectedTemplateId,
      clientName,
      mobile,
      consent,
      staffName: profile?.full_name || "Fintara Team",
      firmName: "Fintara Capital",
      product,
      caseCode: linkedCaseCode,
      stagePlain,
      pendingDocs,
      expectedDate,
      currentRoi,
      estSaving,
    });
  }, [
    selectedTemplateId,
    clientName,
    mobile,
    consent,
    profile,
    product,
    linkedCaseCode,
    stagePlain,
    pendingDocs,
    expectedDate,
    currentRoi,
    estSaving,
  ]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!messageResult.allowed) return;
    navigator.clipboard?.writeText(messageResult.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    if (!messageResult.allowed) return;
    window.open(messageResult.waUrl, "_blank", "noopener,noreferrer");
  };

  const handleMarkAsSent = () => {
    if (!clientId) {
      setMarkedSent(true);
      setTimeout(() => {
        setMarkedSent(false);
        onClose();
      }, 1500);
      return;
    }

    addContactLog({
      date: today,
      client_id: clientId,
      client_name: clientName,
      contact_type: "WhatsApp",
      handled_by: profile?.full_name || "Staff 1",
      linked_case_code: linkedCaseCode,
      linked_loan_code: linkedLoanCode,
      summary: `WhatsApp message dispatched: "${WHATSAPP_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name}"`,
      next_action: "Follow-up on reply",
      next_action_date: today,
    });

    setMarkedSent(true);
    if (onLogged) onLogged();
    setTimeout(() => {
      setMarkedSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 max-w-lg w-full space-y-4 shadow-xl animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-midnight">Send WhatsApp Update</h2>
              <p className="text-xs text-slate">
                {clientName} • +91 {mobile}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate hover:text-midnight">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consent Status Badge (Rule R15) */}
        <div
          className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
            consent
              ? "bg-teal/10 border-teal/20 text-teal-dark"
              : "bg-crimson/10 border-crimson/20 text-crimson"
          }`}
        >
          {consent ? (
            <>
              <Shield className="w-4 h-4 text-teal shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">DPDP Explicit Consent: Recorded ✅</span>
                <span className="text-[11px] text-slate/80">
                  Client has opted in to receive loan updates and transactional notices.
                </span>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Consent Missing / Revoked ⛔</span>
                <span className="text-[11px] text-crimson/90">
                  Per Rule R15, outbound messaging is blocked. Record verbal or written consent first.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Template Selector */}
        <div>
          <label className="block text-xs font-semibold text-midnight mb-1">
            Select Template (Appendix App8)
          </label>
          <select
            disabled={!consent}
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate/20 bg-paper text-xs font-medium focus:outline-teal disabled:opacity-50"
          >
            {WHATSAPP_TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </select>
        </div>

        {/* Message Preview Box */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-midnight">Message Preview</label>
            {consent && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-teal hover:underline flex items-center gap-1 font-medium"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>
            )}
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs whitespace-pre-wrap font-sans leading-relaxed min-h-24 ${
              consent
                ? "bg-[#EFEAE2]/40 border-slate/15 text-midnight font-medium"
                : "bg-paper border-slate/15 text-slate/60 italic"
            }`}
          >
            {consent
              ? messageResult.message
              : "Message content preview disabled because client consent has not been recorded."}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg border border-slate/20 text-slate hover:text-midnight font-semibold"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!consent}
              onClick={handleMarkAsSent}
              className="px-3 py-2 rounded-lg border border-slate/20 bg-paper text-slate hover:text-midnight font-semibold disabled:opacity-40"
            >
              {markedSent ? "Logged! ✓" : "Mark as Sent & Log"}
            </button>

            <button
              type="button"
              disabled={!consent}
              onClick={handleOpenWhatsApp}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-xs flex items-center gap-1.5 disabled:opacity-40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
