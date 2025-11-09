import React from 'react';
import { useLoans } from '../../../context/LoanContext';
import { useCurrency } from '../../../context/CurrencyContext';
import styles from './DashboardFooter.module.css';

/**
 * A footer component for the Dashboard that displays
 * the total principal and total current balance of all loans.
 */
const DashboardFooter = () => {
  // Get the calculated totals and loading state from our LoanContext
  const { totalPrincipal, totalCurrentBalance, isLoading } = useLoans();
  
  // Get the currency formatting function from our CurrencyContext
  const { formatCurrency } = useCurrency();

  if (isLoading) {
    return (
      <footer className={styles.footerContainer}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Principal</span>
          <span className={styles.statValue}>Loading...</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Current Balance</span>
          <span className={styles.statValue}>Loading...</span>
        </div>
      </footer>
    );
  }

  // NOTE: This component assumes all loans are in the same currency
  // for the grand totals. We can make this more robust later if needed.
  return (
    <footer className={styles.footerContainer}>
      {/* Stat Box for Total Principal */}
      <div className={styles.statBox}>
        <span className={styles.statLabel}>Total Principal</span>
        <span className={styles.statValue}>
          {formatCurrency(totalPrincipal)}
        </span>
      </div>
      
      {/* Stat Box for Total Current Balance */}
      <div className={styles.statBox}>
        <span className={styles.statLabel}>Total Current Balance</span>
        <span className={`${styles.statValue} ${styles.totalBalance}`}>
          {formatCurrency(totalCurrentBalance)}
        </span>
      </div>
    </footer>
  );
};

export default DashboardFooter;