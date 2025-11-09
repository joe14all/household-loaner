import React from 'react';
import styles from './AddLoanPage.module.css';
import LoanForm from './LoanForm/LoanForm.jsx';
// 1. Import the app state hook (CORRECTED PATH)
import { useModalState } from '../../context/ModalContext.jsx';

/**
 * This component is now rendered *inside* the modal.
 * Its only job is to provide the title and the form.
 */
const AddLoanPage = () => {
  // 2. Get the closeModal function from our new hook
  const { closeModal } = useModalState();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Add a New Loan</h1>
      <p className={styles.pageSubtitle}>
        Fill in the details below to add a new loan to your tracker.
      </p>
      
      {/* 3. Pass the closeModal function as an onClose prop
           to the LoanForm.
      */}
      <LoanForm onClose={closeModal} />
    </div>
  );
};

export default AddLoanPage;