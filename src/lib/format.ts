/**
 * format.ts — Shared formatting utilities for Fintara Loan Desk.
 *
 * All user-facing numbers and dates pass through these functions.
 * Indian number grouping (lakhs/crores), IST dates, mobile display.
 */

/**
 * Format a number as Indian Rupees with Indian grouping (lakhs, crores).
 * Example: formatINR(1245000) → "₹12,45,000"
 */
export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return "₹0";

  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const rounded = Math.round(abs * 100) / 100;

  // Split into integer and decimal
  const parts = rounded.toFixed(2).split(".");
  const intPart = parts[0];
  const decPart = parts[1];

  // Indian grouping: last 3 digits, then groups of 2
  let formatted: string;
  if (intPart.length <= 3) {
    formatted = intPart;
  } else {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    const groups: string[] = [];
    let i = rest.length;
    while (i > 0) {
      const start = Math.max(0, i - 2);
      groups.unshift(rest.slice(start, i));
      i = start;
    }
    formatted = groups.join(",") + "," + last3;
  }

  // Drop ".00" for whole numbers
  const result = decPart === "00" ? formatted : `${formatted}.${decPart}`;
  return `${isNegative ? "-" : ""}₹${result}`;
}

/**
 * Format a number as compact Indian Rupees.
 * Examples:
 *   formatINRCompact(12500000)  → "₹1.25 Cr"
 *   formatINRCompact(1245000)   → "₹12.45 L"
 *   formatINRCompact(95000)     → "₹95,000"
 */
export function formatINRCompact(amount: number): string {
  if (!Number.isFinite(amount)) return "₹0";

  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const prefix = isNegative ? "-" : "";

  if (abs >= 1_00_00_000) {
    // Crores (1 Cr = 10,000,000)
    const cr = abs / 1_00_00_000;
    const display = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return `${prefix}₹${display} Cr`;
  }

  if (abs >= 1_00_000) {
    // Lakhs (1 L = 100,000)
    const l = abs / 1_00_000;
    const display = l % 1 === 0 ? l.toFixed(0) : l.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return `${prefix}₹${display} L`;
  }

  // Below 1 lakh — use standard Indian grouping
  return `${prefix}${formatINR(abs)}`;
}

/**
 * Format a Date as "20 Sep 2026" (IST).
 * Uses Asia/Kolkata timezone for all display.
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Format a date as ISO string (YYYY-MM-DD) in IST.
 */
export function formatDateISO(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Format a 10-digit Indian mobile number for display.
 * Example: formatMobile("9800000011") → "98000 00011"
 */
export function formatMobile(mobile: string | null | undefined): string {
  if (!mobile) return "—";
  const clean = mobile.replace(/\D/g, "");
  if (clean.length !== 10) return mobile;
  return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}

/**
 * Validate an Indian mobile number.
 * Must be exactly 10 digits starting with 6-9.
 */
export function isValidMobile(mobile: string): boolean {
  return /^[6-9][0-9]{9}$/.test(mobile);
}

/**
 * Format ROI as a percentage string.
 * ROI is stored as a decimal fraction (0.0935 = 9.35%).
 * Example: formatROI(0.0935) → "9.35%"
 */
export function formatROI(roi: number): string {
  if (!Number.isFinite(roi)) return "—";
  return `${(roi * 100).toFixed(2)}%`;
}

/**
 * Format a percentage-point gap.
 * Example: formatPPGap(0.015) → "1.50 pp"
 */
export function formatPPGap(gap: number): string {
  if (!Number.isFinite(gap)) return "—";
  return `${(gap * 100).toFixed(2)} pp`;
}

/**
 * Calculate the number of whole completed months between two dates.
 */
export function monthsElapsed(from: Date, to: Date): number {
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  let total = years * 12 + months;

  // If the day hasn't been reached in the current month, subtract one
  if (to.getDate() < from.getDate()) {
    total -= 1;
  }

  return Math.max(0, total);
}
