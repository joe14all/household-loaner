import React from 'react';
import { useCurrency } from '../../../context/CurrencyContext';
import styles from './AmortizationTable.module.css';

/**
 * Displays the full, row-by-row amortization schedule for a loan.
 *
 * @param {object} props
 * @param {Array} props.schedule - The array of schedule objects from calculateMonthlyAmortization.
 * @param {string} props.currency - The currency code for formatting (e.g., "USD").
 */
const AmortizationTable = ({ schedule, currency }) => {
  const { formatCurrency } = useCurrency();

  if (!schedule || schedule.length === 0) {
    return (
      <div className={styles.emptyState}>
        No amortization data to display. This loan may not have started yet.
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.amortizationTable}>
        <thead>
          <tr>
            <th>Month #</th>
            <th>End of Month</th>
            <th>Opening Balance</th>
            <th>Monthly Interest</th>
            <th>Debt (Bal + Int)</th>
            <th>Payments</th>
            <th>Closing Balance</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.monthNumber}>
              <td data-label="Month #" className={styles.monthCell}>
                {row.monthNumber}
              </td>
              <td data-label="End of Month">
                {row.periodDate.toLocaleDateString()}
              </td>
              <td data-label="Opening Balance" className={styles.numericCell}>
                {formatCurrency(row.openingBalance, currency)}
              </td>
              <td data-label="Monthly Interest" className={styles.numericCell}>
                {formatCurrency(row.monthlyInterest, currency)}
              </td>
              <td data-label="Debt" className={styles.numericCell}>
                {formatCurrency(row.debt, currency)}
              </td>
              <td data-label="Payments" className={`${styles.numericCell} ${styles.paymentCell}`}>
                {row.monthlyPayments > 0 
                  ? formatCurrency(row.monthlyPayments, currency) 
                  : '—'}
              </td>
              <td data-label="Closing Balance" className={`${styles.numericCell} ${styles.closingBalanceCell}`}>
                {formatCurrency(row.closingBalance, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AmortizationTable;