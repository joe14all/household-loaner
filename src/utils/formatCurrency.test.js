// src/utils/formatCurrency.test.js
import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatCurrency"; // Import the function to test

// 'describe' groups related tests together
describe("formatCurrency", () => {
  // 'it' (or 'test') defines a single test case
  it("should format USD correctly", () => {
    // ARRANGE (Setup)
    const amount = 1234.56;
    const currency = "USD";

    // ACT (Run the function)
    const result = formatCurrency(amount, currency);

    // ASSERT (Check the result)
    expect(result).toBe("$1,234.56");
  });

  it("should format EUR correctly", () => {
    const result = formatCurrency(500, "EUR");
    // Note: Intl.NumberFormat formats EUR differently
    expect(result).toBe("€500.00");
  });

  it("should default to USD if currency is not provided", () => {
    const result = formatCurrency(100);
    expect(result).toBe("$100.00");
  });

  it("should handle zero", () => {
    const result = formatCurrency(0, "JPY");
    expect(result).toBe("¥0"); // JPY has no minor units
  });
});
