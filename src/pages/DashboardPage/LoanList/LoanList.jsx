import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoans } from '../../../context/LoanContext';
import { useCurrency } from '../../../context/CurrencyContext';
import styles from './LoanList.module.css';

/**
 * Renders the main list of all loans on the dashboard.
 * Each row is clickable and links to the loan detail page.
 */
const LoanList = () => {
  // Get loan data and loading state from our context
  const { loansWithBalances, isLoading } = useLoans();
  // Get currency formatter
  const { formatCurrency } = useCurrency();
  // Get navigation function
  const navigate = useNavigate();

  // Handle click on a table row
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
            <th>Lender</th>
            <th>Principal</th>
            <th>Start Date</th>
            <th>Yearly Rate</th>
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
              <td data-label="Lender" className={styles.lenderCell}>
                {loan.lenderName}
              </td>
              <td data-label="Principal">
                {formatCurrency(loan.principal, loan.currency)}
              </td>
              <td data-label="Start Date">
                {new Date(loan.startDate).toLocaleDateString()}
              </td>
              <td data-label="Yearly Rate">
                {(loan.yearlyRate * 100).toFixed(2)}%
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