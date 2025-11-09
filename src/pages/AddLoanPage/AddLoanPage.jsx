import React from 'react';
import styles from './AddLoanPage.module.css';
import LoanForm from './LoanForm/LoanForm.jsx';

/**
 * The page component for adding a new loan.
 * It renders the LoanForm and a page title.
 */
const AddLoanPage = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Add a New Loan</h1>
      <p className={styles.pageSubtitle}>
        Fill in the details below to add a new loan to your tracker.
      </p>
      
      {/* This is the LoanForm component we created in the previous step.
        It handles all the logic for data entry and submission.
      */}
      <LoanForm />
    </div>
  );
};

export default AddLoanPage;