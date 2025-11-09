import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoanDetails } from '../../hooks/useLoanDetails.js';
import styles from './LoanDetailPage.module.css';

// Import the new HTML generator
import { generateLoanDetailReportHTML } from '../../utils/generateLoanDetailReportHTML.js';

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
  const navigate = useNavigate();

  // 2. Fetch all data using our custom hook
  const { loan, schedule, payments, isLoading, error, refreshData } = useLoanDetails(id);
  
  // 3. Add generating state
  const [isGenerating, setIsGenerating] = useState(false);

  // --- THIS LINE IS MOVED ---
  // const currentBalance = ...

  // 4. Add the report generation handler
  const handleGenerateReport = async () => {
    // We can safely calculate currentBalance here because this function
    // is only callable *after* the component has rendered.
    const currentBalance = schedule.length > 0
      ? schedule[schedule.length - 1].closingBalance
      : loan.principal;

    setIsGenerating(true);
    try {
      const htmlContent = generateLoanDetailReportHTML(loan, schedule, currentBalance);
      const result = await window.electronAPI.generatePDF(htmlContent);

      if (result.success) {
        console.log(`Report saved to: ${result.filePath}`);
      } else {
        console.warn(`Report save failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error invoking PDF generation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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

  // --- FIX: CALCULATE CURRENT BALANCE *AFTER* THE CHECKS ---
  // Now that we know `loan` is not null, we can safely calculate this.
  const currentBalance = schedule.length > 0
    ? schedule[schedule.length - 1].closingBalance
    : loan.principal;
  // --- END FIX ---

  return (
    <div className={styles.pageContainer}>
      
      {/* 5. Add a container for our page-level buttons */}
      <div className={styles.pageActions}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          &larr; Back to Dashboard
        </button>
        <button 
          onClick={handleGenerateReport} 
          className={styles.reportButton}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

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