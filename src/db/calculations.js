/**
 * Generates the full monthly amortization schedule for a loan.
 * This version applies interest consistently from month one.
 * It calculates up to, but NOT including, the current month.
 *
 * @param {object} loan - The loan object from Dexie (e.g., { id, principal, yearlyRate, startDate, ... }).
 * @param {array} payments - An array of payment objects from Dexie (e.g., [{ id, loanId, paymentDate, paymentAmount }, ...]).
 * @returns {array} - An array of objects, where each object represents one month's schedule.
 */
export function calculateMonthlyAmortization(loan, payments) {
  const schedule = [];

  if (
    !loan ||
    typeof loan.yearlyRate !== "number" ||
    typeof loan.principal !== "number" ||
    !loan.startDate
  ) {
    return schedule;
  }

  const monthlyRate = loan.yearlyRate / 12;

  // --- TIME ZONE FIX ---
  // '2019-06-01' is treated as '2019-05-31TXX:XX:XX' (local) because JS parses it as UTC.
  // We must parse it as local time by splitting the string.
  const dateParts = loan.startDate.split("-"); // [ "2019", "06", "01" ]
  // new Date(year, monthIndex (0-11), day)
  let currentDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

  // Set to the first day of the month to normalize calculations
  currentDate.setDate(1);

  let openingBalance = loan.principal;
  const today = new Date();

  // --- LOGIC FIX ---
  // The loop should stop *before* the current month.
  // If today is 2025-10-09 (October), we want the loop to stop when currentDate hits 2025-10-01.
  // So, endOfLoop is the first day of the *current* month.
  const endOfLoop = new Date(today.getFullYear(), today.getMonth(), 1);

  let monthNumber = 1;

  while (currentDate < endOfLoop) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // 1. Find all payments for this specific month
    const paymentsThisMonth = payments.filter((p) => {
      // Ensure paymentDate is treated as local time
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
    const debt = openingBalance + interestForMonth;

    // 5. Calculate the closing balance
    const closingBalance = debt - totalPaymentsForMonth;

    // Add this month's data to our schedule
    schedule.push({
      monthNumber: monthNumber,
      periodDate: new Date(year, month + 1, 0),
      openingBalance: openingBalance,
      monthlyInterest: interestForMonth,
      debt: debt,
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
