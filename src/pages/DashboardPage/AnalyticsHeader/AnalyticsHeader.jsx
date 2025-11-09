import React from 'react'; // 1. Removed useState
import { useLoans } from '../../../context/LoanContext';
import { useCurrency } from '../../../context/CurrencyContext.jsx';

// 2. Import modal hooks and the new modal component
import { useModalState } from '../../../context/ModalContext.jsx';
import ReportFilterModal from '../../../components/ReportFilterModal/ReportFilterModal.jsx';

// 3. Removed generateReportHTML import
import styles from './AnalyticsHeader.module.css';

/**
 * A header component for the Dashboard that displays
 * high-level analytics and quick actions.
 */
const AnalyticsHeader = () => {
  // 4. Get grand totals for display only
  const { 
    grandTotalPayments, 
    grandTotalCurrentInterest, 
    isLoading 
  } = useLoans();
  
  const { formatCurrency } = useCurrency();
  
  // 5. Get modal functions
  const { openModal, closeModal } = useModalState();
  
  // 6. We no longer need isGenerating state here

  const renderStat = (label, value, style) => (
    <div className={styles.statBox}>
      <span className={styles.statLabel}>{label}</span>
      <span className={`${styles.statValue} ${style || ''}`}>
        {isLoading ? '...' : value}
      </span>
    </div>
  );

  // 7. This function now just opens the modal
  const handleOpenReportModal = () => {
    // Pass 'closeModal' as a prop so the modal can close itself
    openModal(<ReportFilterModal onClose={closeModal} />);
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

      {/* 8. Button now opens the modal */}
      <div className={styles.actionButtonBox}>
        <button 
          className={styles.actionButton}
          onClick={handleOpenReportModal} // <-- CHANGED
          disabled={isLoading} // <-- CHANGED
        >
          {/* Text remains the same, but the action is different */}
          Generate PDF Report
        </button>
      </div>
    </section>
  );
};

export default AnalyticsHeader;