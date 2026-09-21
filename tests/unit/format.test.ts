/**
 * format.test.ts — Unit tests for formatting utilities.
 *
 * Test vectors from spec A4 and Appendix.
 */
import { describe, it, expect } from "vitest";
import {
  formatINR,
  formatINRCompact,
  formatDate,
  formatMobile,
  isValidMobile,
  formatROI,
  formatPPGap,
  monthsElapsed,
} from "@/lib/format";

describe("formatINR", () => {
  it("formats ₹12,45,000", () => {
    expect(formatINR(1245000)).toBe("₹12,45,000");
  });

  it("formats ₹25,00,000", () => {
    expect(formatINR(2500000)).toBe("₹25,00,000");
  });

  it("formats ₹55,00,000", () => {
    expect(formatINR(5500000)).toBe("₹55,00,000");
  });

  it("formats ₹1,10,00,000", () => {
    expect(formatINR(11000000)).toBe("₹1,10,00,000");
  });

  it("formats ₹60,00,000", () => {
    expect(formatINR(6000000)).toBe("₹60,00,000");
  });

  it("formats ₹1,80,00,000", () => {
    expect(formatINR(18000000)).toBe("₹1,80,00,000");
  });

  it("formats small amounts", () => {
    expect(formatINR(500)).toBe("₹500");
    expect(formatINR(5000)).toBe("₹5,000");
    expect(formatINR(50000)).toBe("₹50,000");
  });

  it("handles decimals", () => {
    expect(formatINR(37500)).toBe("₹37,500");
    expect(formatINR(70212)).toBe("₹70,212");
  });

  it("handles zero and edge cases", () => {
    expect(formatINR(0)).toBe("₹0");
    expect(formatINR(NaN)).toBe("₹0");
    expect(formatINR(Infinity)).toBe("₹0");
  });

  it("handles negative amounts", () => {
    expect(formatINR(-1245000)).toBe("-₹12,45,000");
  });
});

describe("formatINRCompact", () => {
  it("formats ₹1.25 Cr", () => {
    expect(formatINRCompact(12500000)).toBe("₹1.25 Cr");
  });

  it("formats ₹12.5 L", () => {
    expect(formatINRCompact(1250000)).toBe("₹12.5 L");
  });

  it("formats ₹1 Cr for exact crore", () => {
    expect(formatINRCompact(10000000)).toBe("₹1 Cr");
  });

  it("formats below 1 lakh with Indian grouping", () => {
    expect(formatINRCompact(95000)).toBe("₹95,000");
  });

  it("formats ₹55 L", () => {
    expect(formatINRCompact(5500000)).toBe("₹55 L");
  });

  it("formats ₹1.1 Cr", () => {
    expect(formatINRCompact(11000000)).toBe("₹1.1 Cr");
  });
});

describe("formatMobile", () => {
  it("formats 10-digit mobile with space", () => {
    expect(formatMobile("9800000011")).toBe("98000 00011");
  });

  it("handles null/undefined", () => {
    expect(formatMobile(null)).toBe("—");
    expect(formatMobile(undefined)).toBe("—");
  });

  it("returns original for non-10-digit", () => {
    expect(formatMobile("12345")).toBe("12345");
  });
});

describe("isValidMobile", () => {
  it("accepts valid Indian mobiles starting 6-9", () => {
    expect(isValidMobile("9800000011")).toBe(true);
    expect(isValidMobile("6123456789")).toBe(true);
    expect(isValidMobile("7999999999")).toBe(true);
    expect(isValidMobile("8000000000")).toBe(true);
  });

  it("rejects invalid mobiles", () => {
    expect(isValidMobile("5800000011")).toBe(false);  // starts with 5
    expect(isValidMobile("1234567890")).toBe(false);  // starts with 1
    expect(isValidMobile("980000001")).toBe(false);   // 9 digits
    expect(isValidMobile("98000000111")).toBe(false);  // 11 digits
    expect(isValidMobile("")).toBe(false);
  });
});

describe("formatROI", () => {
  it("formats 9.35%", () => {
    expect(formatROI(0.0935)).toBe("9.35%");
  });

  it("formats 15.50%", () => {
    expect(formatROI(0.155)).toBe("15.50%");
  });

  it("formats 8.40%", () => {
    expect(formatROI(0.084)).toBe("8.40%");
  });
});

describe("formatPPGap", () => {
  it("formats 0.60 pp", () => {
    expect(formatPPGap(0.006)).toBe("0.60 pp");
  });

  it("formats 1.50 pp", () => {
    expect(formatPPGap(0.015)).toBe("1.50 pp");
  });
});

describe("monthsElapsed", () => {
  it("calculates 15 months for LN-0001", () => {
    // Disbursed 17 Jun 2025, test date 20 Sep 2026
    const from = new Date(2025, 5, 17); // Jun = 5
    const to = new Date(2026, 8, 20);   // Sep = 8
    expect(monthsElapsed(from, to)).toBe(15);
  });

  it("calculates 8 months for LN-0002", () => {
    // Disbursed 13 Jan 2026, test date 20 Sep 2026
    const from = new Date(2026, 0, 13); // Jan = 0
    const to = new Date(2026, 8, 20);   // Sep = 8
    expect(monthsElapsed(from, to)).toBe(8);
  });

  it("returns 0 when from equals to", () => {
    const d = new Date(2026, 0, 1);
    expect(monthsElapsed(d, d)).toBe(0);
  });

  it("subtracts one when day not reached", () => {
    const from = new Date(2026, 0, 31);
    const to = new Date(2026, 1, 15);
    expect(monthsElapsed(from, to)).toBe(0);
  });
});
