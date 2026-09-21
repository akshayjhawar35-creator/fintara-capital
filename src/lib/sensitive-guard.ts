/**
 * sensitive-guard.ts — PAN and Aadhaar detection for client-side validation.
 *
 * Mirrors the Postgres trigger `sensitive_data_guard()`.
 * Never store these numbers in free-text fields.
 */

/** PAN pattern: 5 uppercase letters, 4 digits, 1 uppercase letter */
const PAN_REGEX = /[A-Z]{5}[0-9]{4}[A-Z]/;

/** Aadhaar-like pattern: 12 digits, optionally space-separated in groups of 4 */
const AADHAAR_REGEX = /\b\d{4}\s?\d{4}\s?\d{4}\b/;

export const SENSITIVE_DATA_MESSAGE =
  "This looks like a PAN or Aadhaar number. Please don't store it here — paste the documents folder link instead.";

/**
 * Check if text contains a PAN or Aadhaar-like pattern.
 * Returns the type of sensitive data found, or null if clean.
 */
export function detectSensitiveData(
  text: string
): "PAN" | "Aadhaar" | null {
  if (PAN_REGEX.test(text)) return "PAN";
  if (AADHAAR_REGEX.test(text)) return "Aadhaar";
  return null;
}

/**
 * Check if text is safe (no sensitive data detected).
 */
export function isSafeText(text: string): boolean {
  return detectSensitiveData(text) === null;
}
