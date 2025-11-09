import React from 'react';
import styles from './DashboardPage.module.css';
import LoanList from './LoanList/LoanList.jsx';
import DashboardFooter from './DashboardFooter/DashboardFooter.jsx';

/**
 * The main Dashboard page.
 * It displays the list of all loans and a footer with total balances.
 */
const DashboardPage = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Loan Dashboard</h1>
      
      {/* This is the list of all loans.
        It handles its own loading, empty, and data states.
      */}
      <LoanList />
      
      {/* This is the footer with total calculations.
        It also handles its own loading state.
      */}
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;