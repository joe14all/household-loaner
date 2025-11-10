// src/db/calculations.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { calculateMonthlyAmortization } from "./calculations";

// --- MOCK DATA ---
const mockLoan = {
  id: 1,
  principal: 10000,
  yearlyRate: 0.12, // 1% per month
  startDate: "2025-01-01", // Jan 1, 2025
};

// Set a "today" date for consistent testing
// We'll pretend "today" is March 5th, 2025
const today = new Date("2025-03-05T12:00:00Z");

describe("calculateMonthlyAmortization", () => {
  // --- FIX: Use beforeEach to set timers for every test ---
  beforeEach(() => {
    // Mock the global Date object
    vi.useFakeTimers().setSystemTime(today);
  });

  // Clean up the mock timers
  afterEach(() => {
    vi.useRealTimers();
  });
  // --- END FIX ---

  it("should calculate a schedule for 2 full months", () => {
    // ARRANGE: No payments
    const payments = [];

    // ACT: Calculate the schedule
    const schedule = calculateMonthlyAmortization(mockLoan, payments);

    // ASSERT: We expect 2 rows (Jan, Feb). March has not completed.
    expect(schedule.length).toBe(2);

    // Month 1 (Jan 2025)
    expect(schedule[0].monthNumber).toBe(1);
    expect(schedule[0].openingBalance).toBe(10000);
    expect(schedule[0].monthlyInterest).toBe(100); // 1% of 10000
    expect(schedule[0].debt).toBe(10100);
    expect(schedule[0].monthlyPayments).toBe(0);
    expect(schedule[0].closingBalance).toBe(10100);

    // Month 2 (Feb 2025)
    expect(schedule[1].monthNumber).toBe(2);
    expect(schedule[1].openingBalance).toBe(10100);
    expect(schedule[1].monthlyInterest).toBe(101); // 1% of 10100
    expect(schedule[1].debt).toBe(10201);
    expect(schedule[1].monthlyPayments).toBe(0);
    expect(schedule[1].closingBalance).toBe(10201);
  });

  it("should apply a payment in the correct month", () => {
    // ARRANGE: One payment made in February
    const payments = [
      {
        id: 1,
        loanId: 1,
        paymentDate: "2025-02-15",
        paymentAmount: 201,
      },
    ];

    // ACT
    const schedule = calculateMonthlyAmortization(mockLoan, payments);

    // ASSERT
    expect(schedule.length).toBe(2); // This will now pass

    // Month 1 (Jan) - No payment
    expect(schedule[0].monthlyPayments).toBe(0);
    expect(schedule[0].closingBalance).toBe(10100);

    // Month 2 (Feb) - Payment applied
    expect(schedule[1].openingBalance).toBe(10100);
    expect(schedule[1].monthlyInterest).toBe(101);
    expect(schedule[1].debt).toBe(10201);
    expect(schedule[1].monthlyPayments).toBe(201);
    expect(schedule[1].closingBalance).toBe(10000); // Back to 10k
  });
});
