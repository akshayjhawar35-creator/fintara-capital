/**
 * finance.test.ts — Unit tests for loan mathematics.
 *
 * Test vectors from Appendix App7 (test date 20 Sep 2026).
 * Allow ±₹2 rounding tolerance as specified.
 */
import { describe, it, expect } from "vitest";
import {
  calculateEMI,
  calculateOutstanding,
  calculateBTSaving,
  calculateBTDetailed,
  analyzeTakeover,
  analyzeTopup,
  calculateEligibility,
} from "@/lib/finance";

describe("calculateEMI (R7)", () => {
  it("LN-0001: ₹25,00,000 at 15.5% for 48 months → EMI ₹70,212 (±₹2)", () => {
    const emi = calculateEMI(2500000, 0.155, 48);
    expect(emi).toBeGreaterThanOrEqual(70210);
    expect(emi).toBeLessThanOrEqual(70214);
  });

  it("LN-0002: ₹60,00,000 at 9.1% for 240 months → EMI ₹54,370 (±₹2)", () => {
    const emi = calculateEMI(6000000, 0.091, 240);
    expect(emi).toBeGreaterThanOrEqual(54368);
    expect(emi).toBeLessThanOrEqual(54372);
  });

  it("handles zero ROI", () => {
    const emi = calculateEMI(1200000, 0, 12);
    expect(emi).toBe(100000);
  });

  it("handles zero principal", () => {
    expect(calculateEMI(0, 0.1, 12)).toBe(0);
  });

  it("handles zero tenure", () => {
    expect(calculateEMI(100000, 0.1, 0)).toBe(0);
  });
});

describe("calculateOutstanding (R7)", () => {
  it("LN-0001: ₹25,00,000 at 15.5%, 48mo, 15 elapsed → ₹18,76,770 (±₹2)", () => {
    const outstanding = calculateOutstanding(2500000, 0.155, 48, 15);
    expect(outstanding).toBeGreaterThanOrEqual(1876768);
    expect(outstanding).toBeLessThanOrEqual(1876772);
  });

  it("LN-0002: ₹60,00,000 at 9.1%, 240mo, 8 elapsed → ₹59,27,127 (±₹2)", () => {
    const outstanding = calculateOutstanding(6000000, 0.091, 240, 8);
    expect(outstanding).toBeGreaterThanOrEqual(5927125);
    expect(outstanding).toBeLessThanOrEqual(5927129);
  });

  it("total outstanding matches ₹78,03,897 (±₹4 combined tolerance)", () => {
    const o1 = calculateOutstanding(2500000, 0.155, 48, 15);
    const o2 = calculateOutstanding(6000000, 0.091, 240, 8);
    expect(o1 + o2).toBeGreaterThanOrEqual(7803893);
    expect(o1 + o2).toBeLessThanOrEqual(7803901);
  });

  it("returns 0 when fully elapsed", () => {
    expect(calculateOutstanding(2500000, 0.155, 48, 48)).toBe(0);
    expect(calculateOutstanding(2500000, 0.155, 48, 50)).toBe(0);
  });

  it("returns principal when 0 months elapsed", () => {
    expect(calculateOutstanding(2500000, 0.155, 48, 0)).toBe(2500000);
  });
});

describe("calculateBTSaving (R6)", () => {
  it("₹55,00,000 × (9.35% − 8.40%) = ₹52,250", () => {
    const saving = calculateBTSaving(5500000, 0.0935, 0.084);
    expect(saving).toBe(52250);
  });

  it("returns 0 for zero base", () => {
    expect(calculateBTSaving(0, 0.0935, 0.084)).toBe(0);
  });

  it("can be negative if proposed > existing", () => {
    const saving = calculateBTSaving(5500000, 0.084, 0.0935);
    expect(saving).toBe(-52250);
  });
});

describe("calculateBTDetailed", () => {
  it("includes processing fee and foreclosure in break-even", () => {
    const result = calculateBTDetailed(5500000, 0.0935, 0.084, 27500, 0);
    expect(result.annualSaving).toBe(52250);
    expect(result.totalCharges).toBe(27500);
    expect(result.netFirstYearSaving).toBe(24750);
    // Break-even: 27500 / (52250/12) ≈ 6.32 → 7 months
    expect(result.breakEvenMonths).toBeGreaterThanOrEqual(6);
    expect(result.breakEvenMonths).toBeLessThanOrEqual(7);
  });

  it("no break-even when no charges", () => {
    const result = calculateBTDetailed(5500000, 0.0935, 0.084, 0, 0);
    expect(result.breakEvenMonths).toBeNull();
  });
});

describe("analyzeTakeover (R8)", () => {
  it("LN-0001: ROI 15.5%, market 14%, gap 1.50pp → TAKEOVER CANDIDATE", () => {
    const result = analyzeTakeover(0.155, 0.14, 15, 1876770, {
      takeoverMinMonths: 6,
      takeoverGapPP: 0.005,
    });
    expect(result.isCandidate).toBe(true);
    expect(result.roiGap).toBeCloseTo(0.015, 4);
    expect(result.estAnnualSaving).toBeGreaterThan(0);
  });

  it("LN-0002: ROI 9.1%, market 8.5%, gap 0.60pp → TAKEOVER CANDIDATE", () => {
    const result = analyzeTakeover(0.091, 0.085, 8, 5927127, {
      takeoverMinMonths: 6,
      takeoverGapPP: 0.005,
    });
    expect(result.isCandidate).toBe(true);
    expect(result.roiGap).toBeCloseTo(0.006, 4);
  });

  it("not a candidate when too few months elapsed", () => {
    const result = analyzeTakeover(0.155, 0.14, 3, 1876770, {
      takeoverMinMonths: 6,
      takeoverGapPP: 0.005,
    });
    expect(result.isCandidate).toBe(false);
  });

  it("not a candidate when gap too small", () => {
    const result = analyzeTakeover(0.085, 0.084, 12, 5000000, {
      takeoverMinMonths: 6,
      takeoverGapPP: 0.005,
    });
    expect(result.isCandidate).toBe(false);
  });

  it("not a candidate when no market ROI", () => {
    const result = analyzeTakeover(0.155, null, 15, 1876770, {
      takeoverMinMonths: 6,
      takeoverGapPP: 0.005,
    });
    expect(result.isCandidate).toBe(false);
  });
});

describe("analyzeTopup (R9)", () => {
  it("LN-0001 disbursed Jun 2025, 15 months → TOP-UP WINDOW OPEN", () => {
    const result = analyzeTopup(
      new Date(2025, 5, 17),
      new Date(2026, 8, 20),
      12
    );
    expect(result.isOpen).toBe(true);
  });

  it("LN-0002 disbursed Jan 2026, 8 months → Opens Jan 2027", () => {
    const result = analyzeTopup(
      new Date(2026, 0, 13),
      new Date(2026, 8, 20),
      12
    );
    expect(result.isOpen).toBe(false);
    expect(result.opensDate.getFullYear()).toBe(2027);
    expect(result.opensDate.getMonth()).toBe(0); // January
  });
});

describe("calculateEligibility (FOIR-based)", () => {
  it("calculates a reasonable eligible amount", () => {
    // ₹1,50,000/month, ₹20,000 existing EMIs, 50% FOIR, 9% ROI, 240 months
    const eligible = calculateEligibility(150000, 20000, 0.5, 0.09, 240);
    expect(eligible).toBeGreaterThan(0);
    // Max EMI = 150000 * 0.5 - 20000 = 55000
    // At 9% for 240 months, this should give roughly ₹61L
    expect(eligible).toBeGreaterThan(5000000);
    expect(eligible).toBeLessThan(7000000);
  });

  it("returns 0 when FOIR exceeded", () => {
    expect(calculateEligibility(50000, 50000, 0.5, 0.09, 240)).toBe(0);
  });
});
