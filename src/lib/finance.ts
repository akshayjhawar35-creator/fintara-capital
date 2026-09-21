/**
 * finance.ts — Loan mathematics for Fintara Loan Desk.
 *
 * Implements the formulas from spec A7 (R6, R7, R8).
 * These exact functions are used by both:
 *   1. Public-site calculators (client-side)
 *   2. Postgres views/functions (server-side, mirrored in SQL)
 * Both must pass the same test vectors from Appendix App7.
 *
 * ROI is stored as a decimal fraction: 0.0935 = 9.35% per annum.
 */

/**
 * R7 — Calculate EMI (Equated Monthly Instalment).
 * Fixed-ROI, equal-EMI formula.
 *
 * r = ROI / 12
 * EMI = P·r·(1+r)^n / ((1+r)^n − 1)
 *
 * @param principal - Loan amount (₹)
 * @param annualROI - Annual rate as decimal (e.g. 0.155 = 15.5%)
 * @param tenureMonths - Loan tenure in months
 * @returns Monthly EMI rounded to nearest rupee
 */
export function calculateEMI(
  principal: number,
  annualROI: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualROI <= 0) return Math.round(principal / tenureMonths);

  const r = annualROI / 12;
  const rPlusOne = 1 + r;
  const rPlusOnePowN = Math.pow(rPlusOne, tenureMonths);

  const emi = (principal * r * rPlusOnePowN) / (rPlusOnePowN - 1);
  return Math.round(emi);
}

/**
 * R7 — Estimate outstanding balance after m months.
 *
 * est_outstanding = P·((1+r)^n − (1+r)^m) / ((1+r)^n − 1)
 * Clamped to [0, P]. If m ≥ n, returns 0.
 *
 * @param principal - Original loan amount (₹)
 * @param annualROI - Annual rate as decimal
 * @param tenureMonths - Total tenure in months
 * @param monthsElapsed - Whole completed months from disbursal
 * @returns Estimated outstanding balance rounded to nearest rupee
 */
export function calculateOutstanding(
  principal: number,
  annualROI: number,
  tenureMonths: number,
  monthsElapsed: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (monthsElapsed >= tenureMonths) return 0;
  if (monthsElapsed <= 0) return principal;
  if (annualROI <= 0) {
    // Zero interest: simple linear paydown
    const paid = (principal / tenureMonths) * monthsElapsed;
    return Math.round(Math.max(0, principal - paid));
  }

  const r = annualROI / 12;
  const rPlusOne = 1 + r;
  const rPlusOnePowN = Math.pow(rPlusOne, tenureMonths);
  const rPlusOnePowM = Math.pow(rPlusOne, monthsElapsed);

  const outstanding = (principal * (rPlusOnePowN - rPlusOnePowM)) / (rPlusOnePowN - 1);

  // Clamp to [0, principal]
  return Math.round(Math.max(0, Math.min(principal, outstanding)));
}

/**
 * R6 — Estimate annual saving from a balance transfer.
 *
 * est_annual_saving = base × (existing_roi − proposed_roi)
 * where base = existing_outstanding if given, else amount_requested.
 *
 * @param baseAmount - Outstanding amount or requested amount (₹)
 * @param existingROI - Current annual ROI as decimal
 * @param proposedROI - New annual ROI as decimal
 * @returns Estimated annual saving (₹), can be negative
 */
export function calculateBTSaving(
  baseAmount: number,
  existingROI: number,
  proposedROI: number
): number {
  if (baseAmount <= 0) return 0;
  return Math.round(baseAmount * (existingROI - proposedROI));
}

/**
 * Extended BT calculator — includes processing fee and foreclosure charges.
 *
 * @param baseAmount - Outstanding or requested amount (₹)
 * @param existingROI - Current ROI as decimal
 * @param proposedROI - New ROI as decimal
 * @param processingFee - Processing/setup fee for the new loan (₹)
 * @param foreclosureCharges - Foreclosure/prepayment charges on old loan (₹)
 * @returns Object with saving details
 */
export function calculateBTDetailed(
  baseAmount: number,
  existingROI: number,
  proposedROI: number,
  processingFee: number = 0,
  foreclosureCharges: number = 0
): {
  annualSaving: number;
  totalCharges: number;
  netFirstYearSaving: number;
  breakEvenMonths: number | null;
} {
  const annualSaving = calculateBTSaving(baseAmount, existingROI, proposedROI);
  const totalCharges = processingFee + foreclosureCharges;
  const netFirstYearSaving = annualSaving - totalCharges;

  // Break-even: months until cumulative saving exceeds total charges
  let breakEvenMonths: number | null = null;
  if (annualSaving > 0 && totalCharges > 0) {
    const monthlySaving = annualSaving / 12;
    breakEvenMonths = Math.ceil(totalCharges / monthlySaving);
  }

  return {
    annualSaving,
    totalCharges,
    netFirstYearSaving,
    breakEvenMonths,
  };
}

/**
 * R8 — Check if a loan is a takeover candidate.
 *
 * Conditions (all must be true):
 *   - Loan is Active
 *   - months_elapsed ≥ takeover_min_months
 *   - roi_gap = current_roi − market_roi ≥ takeover_gap_pp
 *   - Product has a market ROI benchmark
 *
 * @returns Object with takeover analysis
 */
export function analyzeTakeover(
  currentROI: number,
  marketROI: number | null,
  monthsElapsed: number,
  estOutstanding: number,
  config: { takeoverMinMonths: number; takeoverGapPP: number }
): {
  isCandidate: boolean;
  roiGap: number;
  estAnnualSaving: number;
} {
  if (marketROI === null || marketROI === undefined) {
    return { isCandidate: false, roiGap: 0, estAnnualSaving: 0 };
  }

  const roiGap = currentROI - marketROI;
  const estAnnualSaving = Math.round(estOutstanding * roiGap);

  const isCandidate =
    monthsElapsed >= config.takeoverMinMonths &&
    roiGap >= config.takeoverGapPP;

  return { isCandidate, roiGap, estAnnualSaving };
}

/**
 * R9 — Check if a top-up window is open.
 *
 * @param disbursedOn - Disbursal date
 * @param today - Current date
 * @param topupAfterMonths - Months after disbursal when top-up opens
 * @returns Object with top-up status
 */
export function analyzeTopup(
  disbursedOn: Date,
  today: Date,
  topupAfterMonths: number
): {
  isOpen: boolean;
  opensDate: Date;
} {
  const opensDate = new Date(disbursedOn);
  opensDate.setMonth(opensDate.getMonth() + topupAfterMonths);

  return {
    isOpen: today >= opensDate,
    opensDate,
  };
}

/**
 * Eligibility calculator (FOIR-based).
 * FOIR = Fixed Obligation to Income Ratio.
 *
 * max_emi = (monthly_income × max_foir) − existing_emis
 * eligible_amount = reverse-engineer from EMI formula
 *
 * @param monthlyIncome - Monthly income (₹)
 * @param existingEMIs - Sum of existing monthly EMIs (₹)
 * @param maxFOIR - Maximum FOIR allowed (e.g. 0.5 = 50%)
 * @param annualROI - Expected annual ROI as decimal
 * @param tenureMonths - Desired tenure in months
 * @returns Estimated eligible loan amount
 */
export function calculateEligibility(
  monthlyIncome: number,
  existingEMIs: number,
  maxFOIR: number,
  annualROI: number,
  tenureMonths: number
): number {
  if (monthlyIncome <= 0 || tenureMonths <= 0 || maxFOIR <= 0) return 0;

  const maxEMI = monthlyIncome * maxFOIR - existingEMIs;
  if (maxEMI <= 0) return 0;

  if (annualROI <= 0) return Math.round(maxEMI * tenureMonths);

  const r = annualROI / 12;
  const rPlusOnePowN = Math.pow(1 + r, tenureMonths);

  // Reverse EMI formula: P = EMI × ((1+r)^n − 1) / (r × (1+r)^n)
  const eligible = (maxEMI * (rPlusOnePowN - 1)) / (r * rPlusOnePowN);
  return Math.round(eligible);
}
