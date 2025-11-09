import React from 'react';
// 1. Import hook from the new ModalContext
import { useModalState } from '../../context/ModalContext.jsx';
import styles from './DashboardPage.module.css';
import LoanList from './LoanList/LoanList.jsx';
import DashboardFooter from './DashboardFooter/DashboardFooter.jsx';
import AddLoanPage from '../AddLoanPage/AddLoanPage.jsx';
// --- NEW: Import the analytics component ---
import AnalyticsHeader from './AnalyticsHeader/AnalyticsHeader.jsx';

/**
 * The main Dashboard page.
 */
const DashboardPage = () => {
  // 2. Get the openModal function from our new hook
  const { openModal } = useModalState();

  return (
    <div className={styles.pageContainer}>
      
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Household Loaner</h1>
        {/* 3. This onClick logic works perfectly as-is */}
        <button 
          onClick={() => openModal(<AddLoanPage />)} 
          className={styles.addButton}
        >
          + Add New Loan
        </button>
      </div>

      {/* --- NEW: Add the analytics header --- */}
      <AnalyticsHeader />
      
      <LoanList />
      
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;