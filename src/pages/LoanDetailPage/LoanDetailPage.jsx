import React from 'react';
// FIX: Removed the stray 'S' from useParams
import { useParams, useNavigate } from 'react-router-dom';
import { useLoanDetails } from '../../hooks/useLoanDetails.js';
import styles from './LoanDetailPage.module.css';

// Import the child components
import LoanHeader from './LoanHeader/LoanHeader.jsx';
import AmortizationTable from './AmortizationTable/AmortizationTable.jsx';
import PaymentManager from './PaymentManager/PaymentManager.jsx';

/**
 * The main page for viewing a single loan's details.
 * It fetches all data and passes it down to its child components.
 */
const LoanDetailPage = () => {
  // 1. Get the 'id' from the URL (e.g., "/loan/1")
  const { id } = useParams();
  const navigate = useNavigate(); // ADDED: For the back button

  // 2. Fetch all data using our custom hook
  const { loan, schedule, payments, isLoading, error, refreshData } = useLoanDetails(id);

  // 3. Handle Loading State
  if (isLoading) {
    return <div className={styles.loading}>Loading loan details...</div>;
  }

  // 4. Handle Error State
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  // 5. Handle "Not Found" State
  if (!loan) {
    return <div className={styles.error}>Loan not found.</div>;
  }

  // 6. Get the current balance for the header
  const currentBalance = schedule.length > 0
    ? schedule[schedule.length - 1].closingBalance
    : loan.principal;

  return (
    <div className={styles.pageContainer}>
      {/* ADDED: Back to Dashboard Button */}
      <button onClick={() => navigate('/')} className={styles.backButton}>
        &larr; Back to Dashboard
      </button>

      {/* Pass the main 'loan' object and the 'currentBalance'
        to the header component.
      */}
      <LoanHeader 
        loan={loan} 
        currentBalance={currentBalance} 
      />
      
      {/* Pass the calculated 'schedule' and 'currency'
        to the table component.
      */}
      <AmortizationTable 
        schedule={schedule} 
        currency={loan.currency} 
      />
      
      {/* Pass the 'loan.id', 'currency', the raw 'payments' list,
        and the 'refreshData' function to the manager component.
      */}
      <PaymentManager 
        loanId={loan.id}
        currency={loan.currency}
        payments={payments}
        refreshData={refreshData}
      />
    </div>
  );
};

export default LoanDetailPage;