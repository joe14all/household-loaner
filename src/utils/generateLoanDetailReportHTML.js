// src/utils/generateLoanDetailReportHTML.js
import { formatCurrency } from "./formatCurrency.js";
import { reportStyles } from "./reportStyles.js";

/**
 * Creates a full HTML string for a single loan's PDF report.
 *
 * @param {object} loan - The full loan object.
 * @param {Array} schedule - The loan's complete amortization schedule.
 * @param {number} currentBalance - The loan's current balance.
 * @returns {string} A complete HTML document as a string.
 */
export const generateLoanDetailReportHTML = (
  loan,
  schedule,
  currentBalance
) => {
  const getMonthYearFromString = (d) => {
    if (!d) return "N/A";
    const parts = d.split("-");
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  const getMonthYearFromDate = (date) => {
    if (!date) return "N/A";
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  const generationDate = new Date().toLocaleDateString();

  // --- 1. Build Amortization Table Rows ---
  const scheduleRows = schedule
    .map(
      (row) => `
    <tr>
      <td class="numeric">${row.monthNumber}</td>
      <td>${getMonthYearFromDate(row.periodDate)}</td>
      <td class="numeric">${formatCurrency(
        row.openingBalance,
        loan.currency
      )}</td>
      <td class="numeric">${formatCurrency(
        row.monthlyInterest,
        loan.currency
      )}</td>
      <td class="numeric">${formatCurrency(row.debt, loan.currency)}</td>
      <td class="numeric">${
        row.monthlyPayments > 0
          ? formatCurrency(row.monthlyPayments, loan.currency)
          : "—"
      }</td>
      <td class="numeric">${formatCurrency(
        row.closingBalance,
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
        <title>Loan Report: ${loan.lenderName}</title>
        <style>${reportStyles}</style>
      </head>
      <body>

        <header>
          <h1>Loan Report: ${loan.lenderName}</h1>
          <p class="subtitle">${
            loan.description || `Loan details as of ${generationDate}`
          }</p>
        </header>
        
        <h2>Loan Summary</h2>
        <div class="loan-header-grid">
          <div class="stat-box">
            <span class="stat-label">Current Balance</span>
            <span class="stat-value brand">${formatCurrency(
              currentBalance,
              loan.currency
            )}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Original Principal</span>
            <span class="stat-value">${formatCurrency(
              loan.principal,
              loan.currency
            )}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Yearly Rate</span>
            <span class="stat-value">${(loan.yearlyRate * 100).toFixed(
              2
            )}%</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Start Date</span>
            <span class="stat-value">${getMonthYearFromString(
              loan.startDate
            )}</span>
          </div>
        </div>

        <h2>Amortization Schedule</h2>
        <table>
          <thead>
            <tr>
              <th class="numeric">Month #</th>
              <th>Month / Year</th>
              <th class="numeric">Opening Balance</th>
              <th class="numeric">Monthly Interest</th>
              <th class="numeric">Debt (Bal + Int)</th>
              <th class="numeric">Payments</th>
              <th class="numeric">Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            ${scheduleRows}
          </tbody>
        </table>

        <footer>
          <p>Confidential Loan Report for ${loan.lenderName}</p>
        </footer>

      </body>
    </html>
  `;
};
