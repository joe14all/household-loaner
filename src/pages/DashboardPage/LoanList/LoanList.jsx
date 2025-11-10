import React from 'react';
import { useNavigate } from 'react-router-dom';
// --- NEW IMPORTS ---
import { useModalState } from '../../../context/ModalContext.jsx'; 
import { deleteLoan } from '../../../db/loans.js';
import LoanForm from '../../AddLoanPage/LoanForm/LoanForm.jsx';
// --- END NEW IMPORTS ---
import { useLoans } from '../../../context/LoanContext';
import { useCurrency } from '../../../context/CurrencyContext';
import styles from './LoanList.module.css';

/**
 * Helper function to parse a YYYY-MM-DD string as a local date
// ... (getLocalDateString function remains unchanged)
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
  const { loansWithBalances, isLoading, refreshLoans } = useLoans();
  const { formatCurrency } = useCurrency();
  const { openModal, closeModal } = useModalState(); // Get modal functions
  const navigate = useNavigate();

  // Primary navigation for clicking the row
  const handleRowClick = (id) => {
    navigate(`/loan/${id}`);
  };

  // --- NEW HANDLERS ---
  const handleEdit = (e, loan) => {
    // CRITICAL: Stop propagation to prevent the parent <tr> click from firing
    e.stopPropagation();
    
    // Open the modal with the LoanForm, passing the loan data
    openModal(
      <LoanForm onClose={closeModal} initialLoan={loan} />
    );
  };
  
  const handleDelete = async (e, loanId, lenderName) => {
    // CRITICAL: Stop propagation to prevent the parent <tr> click from firing
    e.stopPropagation();

    // 1. Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the loan from ${lenderName}? This action is irreversible and will delete all associated payments.`
    );

    if (confirmed) {
      try {
        // 2. Perform deletion
        await deleteLoan(loanId);
        // 3. Refresh list
        await refreshLoans();
        console.log(`Successfully deleted loan ID: ${loanId}`);
      } catch (error) {
        console.error("Failed to delete loan:", error);
        window.alert(`Failed to delete loan: ${error.message}`);
      }
    }
  };
  // --- END NEW HANDLERS ---


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
            <th className={styles.priorityHeader}>Priority</th>
            <th>Lender</th>
            <th>Principal</th>
            <th className={styles.numericHeader}>Months Elapsed</th>
            <th>Start Date</th>
            <th>Yearly Rate</th>
            <th className={styles.numericHeader}>Current Interest</th>
            <th className={styles.numericHeader}>Total Paid</th>
            <th>Current Balance</th>
            {/* --- NEW COLUMN HEADER --- */}
            <th className={styles.actionHeader}>Actions</th>
            {/* --- END NEW COLUMN HEADER --- */}
          </tr>
        </thead>
        <tbody>
          {loansWithBalances.map((loan) => (
            <tr 
              key={loan.id} 
              onClick={() => handleRowClick(loan.id)}
              title={`View details for ${loan.lenderName}`}
            >
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
              <td data-label="Months Elapsed" className={styles.numericCell}>
                {loan.monthsElapsed}
              </td>
              <td data-label="Start Date">
                {getLocalDateString(loan.startDate)}
              </td>
              <td data-label="Yearly Rate">
                {(loan.yearlyRate * 100).toFixed(2)}%
              </td>
              <td data-label="Current Interest" className={`${styles.numericCell} ${styles.interestCell}`}>
                {formatCurrency(loan.nextMonthInterest, loan.currency)}
              </td>
              <td data-label="Total Paid" className={`${styles.numericCell} ${styles.totalPaidCell}`}>
                {loan.totalPayments > 0 
                  ? formatCurrency(loan.totalPayments, loan.currency)
                  : '—'}
              </td>
              <td data-label="Current Balance" className={styles.balanceCell}>
                {formatCurrency(loan.currentBalance, loan.currency)}
              </td>
              
              {/* --- NEW ACTIONS CELL --- */}
              <td data-label="Actions" className={styles.actionCell}>
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={(e) => handleEdit(e, loan)}
                  title="Edit Loan"
                >
                  Edit
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={(e) => handleDelete(e, loan.id, loan.lenderName)}
                  title="Delete Loan"
                >
                  Delete
                </button>
              </td>
              {/* --- END NEW ACTIONS CELL --- */}

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanList;