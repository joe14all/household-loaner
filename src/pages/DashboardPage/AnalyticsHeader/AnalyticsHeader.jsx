import React, { useState } from 'react';
import { useLoans } from '../../../context/LoanContext';
import { useCurrency } from '../../../context/CurrencyContext.jsx';
// 1. Remove useCurrency, we don't format in this file anymore
// 2. Import our new HTML generator
import { generateReportHTML } from '../../../utils/generateReportHTML.js';
import styles from './AnalyticsHeader.module.css';

/**
 * A header component for the Dashboard that displays
 * high-level analytics and quick actions.
 */
const AnalyticsHeader = () => {
  // 3. Get ALL the data from useLoans for the report
  const { 
    loansWithBalances,
    totalPrincipal,
    totalCurrentBalance,
    grandTotalPayments, 
    grandTotalCurrentInterest, 
    isLoading 
  } = useLoans();
  
  // 4. We can now get formatCurrency from the hook in the renderStat
  //    (Oh, wait, the stats are in LoanContext now. We DO need useCurrency.)
  //    Re-adding useCurrency:
  const { formatCurrency } = useCurrency();
  
  const [isGenerating, setIsGenerating] = useState(false);

  const renderStat = (label, value, style) => (
    <div className={styles.statBox}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${style || ''}`}>
        {isLoading ? '...' : value}
      </span>
    </div>
  );

  // 4. Make the function async
  const handleGeneratePDF = async () => {
    console.log("PDF Generation Requested...");
    setIsGenerating(true);

    // 5. Build the data object for the report
    const summary = {
      grandTotalPayments,
      grandTotalCurrentInterest,
      totalCurrentBalance,
      totalPrincipal
    };

    // 6. Generate the HTML string
    const htmlContent = generateReportHTML(loansWithBalances, summary);

    try {
      // 7. Send the HTML to Electron via the Preload API
      const result = await window.electronAPI.generatePDF(htmlContent);

      if (result.success) {
        console.log(`PDF successfully saved to: ${result.filePath}`);
        // We can't use alert. We'll use a console log for now.
        // A better solution would be a modal or toast notification.
      } else {
        console.warn(`PDF save failed: ${result.error}`);
      }

    } catch (error) {
      console.error("Error invoking PDF generation:", error);
      // This is a more serious error (e.g., preload script failed)
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className={styles.statsGrid}>
      {/* Stat 1: Total Payments */}
      {renderStat(
        "Total Payments Made", 
        formatCurrency(grandTotalPayments),
        styles.positive
      )}
      
      {/* Stat 2: Current Monthly Interest */}
      {renderStat(
        "Current Monthly Interest", 
        formatCurrency(grandTotalCurrentInterest),
        styles.info
      )}

      {/* 5. Add the new Action Button as the third item in the grid */}
      <div className={styles.actionButtonBox}>
        <button 
          className={styles.actionButton}
          onClick={handleGeneratePDF}
          disabled={isGenerating || isLoading} // Also disable if loans are loading
        >
          {isGenerating ? 'Generating...' : 'Generate PDF Report'}
        </button>
      </div>
    </section>
  );
};

export default AnalyticsHeader;