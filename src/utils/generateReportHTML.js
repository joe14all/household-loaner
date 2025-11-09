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
  // --- FIX: Renamed and updated to format as MMM-YYYY ---
  const getMonthYearFromString = (d) => {
    if (!d) return "N/A";
    const parts = d.split("-");
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  // --- 1. Build Loan Table Rows ---
  const loanRows = loans
    .map(
      (loan) => `
    <tr>
      <td>${loan.lenderName}</td>
      <td class="numeric">${formatCurrency(loan.principal, loan.currency)}</td>
      <td class="numeric">${getMonthYearFromString(loan.startDate)}</td>
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

  // --- NEW: Calculate Total Interest Paid ---
  // This is: Total Payments - (Original Principal - Current Balance)
  const totalInterestPaid =
    summary.grandTotalPayments -
    (summary.totalPrincipal - summary.totalCurrentBalance);

  // --- 2. Build the Full HTML Document ---
  const generationDate = new Date().toLocaleDateString();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Household Loans Report</title>
        <style>${reportStyles}</style>
      </head>
      <body>

        <header>
          <h1>Household Loans Summary Report</h1>
          <p class="subtitle">Generated on ${generationDate}</p>
        </header>
        
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
            
        
            <div class="stat-breakdown">
              <div>
                <span class="breakdown-label">Original Principal:</span>
                <span class="breakdown-value">${formatCurrency(
                  summary.totalPrincipal
                )}</span>
              </div>
              <div>
                <span class="breakdown-label">Total Interest Paid:</span>
                <span class="breakdown-value interest-value">${formatCurrency(
                  totalInterestPaid
                )}</span>
              </div>
            </div>
       

          </div>
   
        </div>

        <h2>All Loans</h2>
        <table>
          <thead>
            <tr>
              <th>Lender</th>
              <th class="numeric">Principal</th>
              <th class="numeric">Start Date</th>
              <th class="numeric">Rate</th>
              <th class="numeric">Months</th>
              <th class="numeric">Current Interest</th>
              <th class="numeric">Total Paid</th>
              <th class="numeric">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${loanRows}
          </tbody>
        </table>

        <footer>
          <p>Confidential Household Report</p>
        </footer>

      </body>
    </html>
  `;
};
