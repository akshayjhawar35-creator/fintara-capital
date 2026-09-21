/**
 * whatsapp.ts — WhatsApp Template Engine & DPDP Consent Gate (Rules R15, R22, R24, Appendix App8)
 *
 * All WhatsApp messages must comply with:
 * 1. Prior explicit consent (Rule R15). Blocked if consent is "No" or missing.
 * 2. Mandated opt-out ending: "Reply STOP to stop these updates."
 * 3. Exact templates from Appendix App8.
 */

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "lead" | "case" | "portfolio" | "general";
  templateText: string;
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "t1_docs_reminder",
    name: "Documents Reminder",
    category: "case",
    templateText:
      "Hello {client_name}, this is {staff_name} from {firm}. For your {product} application we still need: {pending_docs}. Please send them when convenient so we can keep things moving.",
  },
  {
    id: "t2_status_update",
    name: "Status Update",
    category: "case",
    templateText:
      "Hello {client_name}, a quick update on your {product} application ({case_code}): it is now at '{stage_plain}'. We expect the next step by {expected_date}. Call me if you have questions.",
  },
  {
    id: "t3_sanction_news",
    name: "Sanction Letter Issued",
    category: "case",
    templateText:
      "Good news, {client_name}! Your {product} has been sanctioned by the lender. I'll call you to explain the next steps.",
  },
  {
    id: "t4_disbursal_thankyou",
    name: "Disbursal Thank-you",
    category: "case",
    templateText:
      "Hello {client_name}, your {product} has been disbursed. Thank you for trusting {firm}. I'll check in with you in a few weeks.",
  },
  {
    id: "t5_rate_update",
    name: "Market Rate Update",
    category: "portfolio",
    templateText:
      "Hello {client_name}, market rates for {product} have changed. If you'd like, I can check what applies to your loan.",
  },
  {
    id: "t6_takeover_saving",
    name: "Takeover Opportunity (Saving)",
    category: "portfolio",
    templateText:
      "Hello {client_name}, your {product} runs at {current_roi}. Based on today's market rate, you may be able to save around {est_saving} a year. This is only an estimate and depends on lender approval, eligibility and charges. Shall we check?",
  },
  {
    id: "t7_review_call",
    name: "Routine Portfolio Review",
    category: "portfolio",
    templateText:
      "Hello {client_name}, it's time for a routine review of your {product}. When is a good time to talk?",
  },
  {
    id: "t8_topup_opportunity",
    name: "Top-up Opportunity",
    category: "portfolio",
    templateText:
      "Hello {client_name}, you may now be eligible to explore a top-up on your {product}, subject to the lender's assessment. Would you like me to check?",
  },
  {
    id: "t9_birthday_greeting",
    name: "Birthday / Anniversary Greeting",
    category: "general",
    templateText: "Warm wishes from all of us at {firm}, {client_name}!",
  },
  {
    id: "t10_gentle_followup",
    name: "Gentle Follow-up",
    category: "lead",
    templateText:
      "Hello {client_name}, just following up on your {product} enquiry. Is now a good time to continue?",
  },
];

export const MANDATORY_OPT_OUT = "Reply STOP to stop these updates.";

export interface BuildMessageParams {
  templateId: string;
  clientName: string;
  mobile: string;
  consent: boolean; // DPDP explicit consent
  staffName?: string;
  firmName?: string;
  product?: string;
  caseCode?: string;
  stagePlain?: string;
  pendingDocs?: string;
  expectedDate?: string;
  currentRoi?: string;
  estSaving?: string;
}

export interface BuildMessageResult {
  allowed: boolean;
  blockReason?: string;
  message: string;
  waUrl: string;
}

export function buildWhatsAppMessage(params: BuildMessageParams): BuildMessageResult {
  // Rule R15: Consent gate
  if (!params.consent) {
    return {
      allowed: false,
      blockReason:
        "Outbound messaging blocked: Client consent is not recorded or has been revoked under DPDP rules.",
      message: "",
      waUrl: "",
    };
  }

  const template =
    WHATSAPP_TEMPLATES.find((t) => t.id === params.templateId) || WHATSAPP_TEMPLATES[0];

  const firm = params.firmName || "Fintara Capital";
  const staff = params.staffName || "Team Fintara";

  let body = template.templateText
    .replace(/{client_name}/g, params.clientName || "Valued Client")
    .replace(/{staff_name}/g, staff)
    .replace(/{firm}/g, firm)
    .replace(/{product}/g, params.product || "Loan")
    .replace(/{case_code}/g, params.caseCode || "")
    .replace(/{stage_plain}/g, params.stagePlain || "Under Processing")
    .replace(/{pending_docs}/g, params.pendingDocs || "required KYC/financial documents")
    .replace(/{expected_date}/g, params.expectedDate || "soon")
    .replace(/{current_roi}/g, params.currentRoi || "your current rate")
    .replace(/{est_saving}/g, params.estSaving || "interest savings");

  const fullMessage = `${body}\n\n${MANDATORY_OPT_OUT}`;

  // Clean mobile: strip spaces, dashes, leading 0 or +91
  let cleanMobile = params.mobile.replace(/[\s\-\+]/g, "");
  if (cleanMobile.startsWith("91") && cleanMobile.length === 12) {
    // already has 91
  } else if (cleanMobile.length === 10) {
    cleanMobile = `91${cleanMobile}`;
  }

  const waUrl = `https://wa.me/${cleanMobile}?text=${encodeURIComponent(fullMessage)}`;

  return {
    allowed: true,
    message: fullMessage,
    waUrl,
  };
}
