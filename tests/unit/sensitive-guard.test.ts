/**
 * sensitive-guard.test.ts — Tests for PAN/Aadhaar detection.
 */
import { describe, it, expect } from "vitest";
import {
  detectSensitiveData,
  isSafeText,
  SENSITIVE_DATA_MESSAGE,
} from "@/lib/sensitive-guard";

describe("detectSensitiveData", () => {
  it("detects a PAN number (ABCDE1234F)", () => {
    expect(detectSensitiveData("His PAN is ABCDE1234F")).toBe("PAN");
  });

  it("detects PAN embedded in text", () => {
    expect(detectSensitiveData("documents with BHKPS4321L received")).toBe("PAN");
  });

  it("detects 12-digit Aadhaar (1234 5678 9012)", () => {
    expect(detectSensitiveData("Aadhaar: 1234 5678 9012")).toBe("Aadhaar");
  });

  it("detects Aadhaar without spaces (123456789012)", () => {
    expect(detectSensitiveData("ID 123456789012 verified")).toBe("Aadhaar");
  });

  it("returns null for safe text", () => {
    expect(detectSensitiveData("Client called, documents pending")).toBeNull();
  });

  it("returns null for short numbers", () => {
    expect(detectSensitiveData("Amount is 1245000")).toBeNull();
  });

  it("returns null for mobile numbers", () => {
    expect(detectSensitiveData("Call 9800000011")).toBeNull();
  });

  it("has the correct error message", () => {
    expect(SENSITIVE_DATA_MESSAGE).toContain("PAN or Aadhaar");
    expect(SENSITIVE_DATA_MESSAGE).toContain("documents folder link");
  });
});

describe("isSafeText", () => {
  it("returns true for clean text", () => {
    expect(isSafeText("Normal business note")).toBe(true);
  });

  it("returns false for PAN", () => {
    expect(isSafeText("ABCDE1234F")).toBe(false);
  });

  it("returns false for Aadhaar", () => {
    expect(isSafeText("1234 5678 9012")).toBe(false);
  });
});
