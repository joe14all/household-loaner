// src/db/calculations.js

/**
 * Generates the full monthly amortization schedule for a loan.
 * Replicates the logic from your Excel sheets.
 *
 * @param {object} loan - The loan object from Dexie (e.g., { id, principal, yearlyRate, startDate, ... }).
 * @param {array} payments - An array of payment objects from Dexie (e.g., [{ id, loanId, paymentDate, paymentAmount }, ...]).
 * @returns {array} - An array of objects, where each object represents one month's schedule.
 */
export function calculateMonthlyAmortization(loan, payments) {
  const schedule = [];

  // Handle empty or invalid loan
  if (
    !loan ||
    typeof loan.yearlyRate !== "number" ||
    typeof loan.principal !== "number" ||
    !loan.startDate
  ) {
    return schedule;
  }

  const monthlyRate = loan.yearlyRate / 12;

  let currentDate = new Date(loan.startDate);
  // Set to the first day of the month to normalize calculations
  currentDate.setDate(1);

  let openingBalance = loan.principal;
  const today = new Date();

  // We loop until the month *after* the current one.
  // This ensures we include the current, active month.
  const endOfLoop = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  let monthNumber = 1;

  while (currentDate < endOfLoop) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // 1. Find all payments for this specific month
    const paymentsThisMonth = payments.filter((p) => {
      const paymentDate = new Date(p.paymentDate);
      return (
        paymentDate.getMonth() === month && paymentDate.getFullYear() === year
      );
    });

    // 2. Sum the payments for this month
    const totalPaymentsForMonth = paymentsThisMonth.reduce(
      (sum, p) => sum + p.paymentAmount,
      0
    );

    // 3. Calculate interest for this month
    const interestForMonth = openingBalance * monthlyRate;

    // 4. Calculate the "Debt" (Balance before payments)
    // This matches the "Debt ( Intrest+ prime) ($)" column
    const debt = openingBalance + interestForMonth;

    // 5. Calculate the closing balance
    // This matches the "Balance ( Debt- Payment ) ($)" column
    const closingBalance = debt - totalPaymentsForMonth;

    // Add this month's data to our schedule
    schedule.push({
      monthNumber: monthNumber,
      // The "End of Month" date (e.g., June 30th)
      periodDate: new Date(year, month + 1, 0),
      // "Previous month balance ($)"
      openingBalance: openingBalance,
      // "Monthly intrest ($)"
      monthlyInterest: interestForMonth,
      debt: debt,
      // "Payment done by Joe ($)"
      monthlyPayments: totalPaymentsForMonth,
      closingBalance: closingBalance,
    });

    // 6. Set up for the next loop
    openingBalance = closingBalance;
    currentDate.setMonth(currentDate.getMonth() + 1);
    monthNumber++;
  }

  return schedule;
}
