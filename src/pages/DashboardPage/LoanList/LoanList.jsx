import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoans } from '../../../context/LoanContext';
import { useCurrency } from '../../../context/CurrencyContext';
import styles from './LoanList.module.css';

/**
 * Helper function to parse a YYYY-MM-DD string as a local date
 * and avoid time zone conversion errors.
 */
const getLocalDateString = (dateString) => {
  if (!dateString) return 'N/A';
  // '2019-06-01' -> ["2019", "06", "01"]
  const dateParts = dateString.split('-');
  // new Date(year, monthIndex, day)
  const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  return localDate.toLocaleDateString(); // Formats as '6/1/2019' (or local equivalent)
};

/**
 * Renders the main list of all loans on the dashboard.
 */
const LoanList = () => {
  const { loansWithBalances, isLoading } = useLoans();
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/loan/${id}`);
  };

  // 1. Loading State
  if (isLoading) {
    return <div className={styles.loading}>Loading loans...</div>;
  }

  // 2. Empty State (No loans found)
  if (!isLoading && loansWithBalances.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>No loans found.</h2>
        <p>Click "Add New Loan" in the sidebar to get started.</p>
      </div>
    );
  }

  // 3. Data Loaded State
  return (
    <div className={styles.tableContainer}>
      <table className={styles.loanTable}>
        <thead>
          <tr>
            {/* NEW: Added "Priority" column */}
            <th className={styles.priorityHeader}>Priority</th>
            <th>Lender</th>
            <th>Principal</th>
            {/* NEW: Added "Months Elapsed" column */}
            <th className={styles.numericHeader}>Months Elapsed</th>
            <th>Start Date</th>
            <th>Yearly Rate</th>
            {/* --- NEW COLUMN ADDED --- */}
            <th className={styles.numericHeader}>Current Interest</th>
            {/* --- END NEW COLUMN --- */}
            <th className={styles.numericHeader}>Total Paid</th>
            <th>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {loansWithBalances.map((loan) => (
            <tr 
              key={loan.id} 
              onClick={() => handleRowClick(loan.id)}
              title={`View details for ${loan.lenderName}`}
            >
              {/* NEW: Priority Cell */}
              <td data-label="Priority" className={styles.priorityCell}>
                {loan.isHighestInterest && (
                  <span className={styles.priorityTag} title="This loan will generate the most interest next month.">
                    Top Priority
                  </span>
                )}
              </td>
              <td data-label="Lender" className={styles.lenderCell}>
                {loan.lenderName}
              </td>
              <td data-label="Principal">
                {formatCurrency(loan.principal, loan.currency)}
              </td>
              {/* NEW: Months Elapsed Cell */}
              <td data-label="Months Elapsed" className={styles.numericCell}>
                {loan.monthsElapsed}
              </td>
              <td data-label="Start Date">
                {/* --- TIME ZONE FIX ---
                  Use our new helper function to display the correct local date
                */}
                {getLocalDateString(loan.startDate)}
              </td>
              <td data-label="Yearly Rate">
                {(loan.yearlyRate * 100).toFixed(2)}%
              </td>
              {/* --- NEW CELL ADDED --- */}
              <td data-label="Current Interest" className={`${styles.numericCell} ${styles.interestCell}`}>
                {formatCurrency(loan.nextMonthInterest, loan.currency)}
              </td>
              {/* --- END NEW CELL --- */}
              <td data-label="Total Paid" className={`${styles.numericCell} ${styles.totalPaidCell}`}>
                {loan.totalPayments > 0 
                  ? formatCurrency(loan.totalPayments, loan.currency)
                  : '—'}
              </td>
              <td data-label="Current Balance" className={styles.balanceCell}>
                {formatCurrency(loan.currentBalance, loan.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanList;