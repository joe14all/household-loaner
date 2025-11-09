import React from 'react';
import { useCurrency } from '../../../context/CurrencyContext';
import styles from './LoanHeader.module.css';

/**
 * Helper function to parse a YYYY-MM-DD string as a local date
 * and avoid time zone conversion errors.
 */
const getLocalDateString = (dateString) => {
  if (!dateString) return 'N/A';
  const dateParts = dateString.split('-');
  const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  return localDate.toLocaleDateString();
};

/**
 * Displays the high-level summary of a loan at the top
 * of the Loan Detail Page.
 *
 * @param {object} props
 * @param {object} props.loan - The full loan object from the DB.
 * @param {number} props.currentBalance - The calculated current balance.
 */
const LoanHeader = ({ loan, currentBalance }) => {
  const { formatCurrency } = useCurrency();

  // The parent page (LoanDetailPage) will handle the loading state,
  // but we'll add a check here just in case.
  if (!loan) {
    return <div className={styles.headerContainer}>Loading...</div>;
  }

  return (
    <header className={styles.headerContainer}>
      {/* Main Title */}
      <h1 className={styles.title}>Loan from {loan.lenderName}</h1>
      
      {/* Description (if it exists) */}
      {loan.description && (
        <p className={styles.description}>{loan.description}</p>
      )}

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {/* Stat 1: Current Balance (Primary) */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Current Balance</span>
          <span className={`${styles.statValue} ${styles.primaryBalance}`}>
            {formatCurrency(currentBalance, loan.currency)}
          </span>
        </div>
        
        {/* Stat 2: Original Principal */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Original Principal</span>
          <span className={styles.statValue}>
            {formatCurrency(loan.principal, loan.currency)}
          </span>
        </div>

        {/* Stat 3: Yearly Rate */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Yearly Rate</span>
          <span className={styles.statValue}>
            {(loan.yearlyRate * 100).toFixed(2)}%
          </span>
        </div>
        
        {/* Stat 4: Start Date */}
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Start Date</span>
          {/* --- CRITICAL TYPO FIX ---
            My last update had a typo here (`className{...`).
            This is the correct syntax.
          */}
          <span className={styles.statValue}>
            {getLocalDateString(loan.startDate)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default LoanHeader;