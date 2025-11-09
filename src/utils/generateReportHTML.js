import { formatCurrency } from "./formatCurrency.js";
import { reportStyles } from "./reportStyles.js";

/**
 * Creates a full HTML string for the PDF report.
 *
 * @param {Array} loans - The loansWithBalances array.
 * @param {object} summary - An object with summary totals.
 * @returns {string} A complete HTML document as a string.
 */
export const generateReportHTML = (loans, summary) => {
  // Helper to format dates
  const getLocalDate = (d) => {
    if (!d) return "N/A";
    const parts = d.split("-");
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString();
  };

  // --- 1. Build Loan Table Rows ---
  const loanRows = loans
    .map(
      (loan) => `
    <tr>
      <td>${loan.lenderName}</td>
      <td class="numeric">${formatCurrency(loan.principal, loan.currency)}</td>
      <td class="numeric">${getLocalDate(loan.startDate)}</td>
      <td class="numeric">${(loan.yearlyRate * 100).toFixed(2)}%</td>
      <td class="numeric">${loan.monthsElapsed}</td>
      <td class="numeric">${formatCurrency(
        loan.nextMonthInterest,
        loan.currency
      )}</td>
      <td class="numeric">${formatCurrency(
        loan.totalPayments,
        loan.currency
      )}</td>
      <td class="numeric">${formatCurrency(
        loan.currentBalance,
        loan.currency
      )}</td>
    </tr>
  `
    )
    .join("");

  // --- 2. Build the Full HTML Document ---
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Household Loans Report</title>
        <style>${reportStyles}</style>
      </head>
      <body>
        <h1>Household Loans Summary Report</h1>
        
        <h2>Overall Summary</h2>
        <div class="summary-grid">
          <div class="stat-box">
            <span class="stat-label">Total Payments Made</span>
            <span class="stat-value positive">${formatCurrency(
              summary.grandTotalPayments
            )}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Current Monthly Interest</span>
            <span class="stat-value info">${formatCurrency(
              summary.grandTotalCurrentInterest
            )}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Total Current Balance</span>
            <span class="stat-value brand">${formatCurrency(
              summary.totalCurrentBalance
            )}</span>
          </div>
        </div>

        <h2>All Loans</h2>
        <table>
          <thead>
            <tr>
              <th>Lender</th>
              <th>Principal</th>
              <th>Start Date</th>
              <th>Rate</th>
              <th>Months</th>
              <th>Current Interest</th>
              <th>Total Paid</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            ${loanRows}
          </tbody>
        </table>

      </body>
    </html>
  `;
};
