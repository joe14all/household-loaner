import React, { useState } from 'react';
// 1. Remove useNavigate
import styles from './LoanForm.module.css';
import { addNewLoan } from '../../../db/loans';
import { useLoans } from '../../../context/LoanContext';

// 2. Accept 'onClose' as a prop
const LoanForm = ({ onClose }) => {
  const [lenderName, setLenderName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [yearlyRate, setYearlyRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // 3. Remove navigate
  const { refreshLoans } = useLoans();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Form Validation ---
    if (!lenderName || !principal || !yearlyRate || !startDate) {
      setError('Please fill out all required fields.');
      return;
    }

    const principalAmount = parseFloat(principal);
    const ratePercent = parseFloat(yearlyRate);

    if (isNaN(principalAmount) || principalAmount <= 0) {
      setError('Principal must be a positive number.');
      return;
    }
    if (isNaN(ratePercent) || ratePercent <= 0) {
      setError('Interest rate must be a positive number.');
      return;
    }
    
    // Convert to decimal for storage
    const loanData = {
      lenderName,
      principal: principalAmount,
      yearlyRate: ratePercent / 100, 
      startDate,
      currency,
      description
    };

    try {
      await addNewLoan(loanData);
      await refreshLoans();
      
      // 4. Call onClose() on success
      onClose();
      
    } catch (dbError) {
      console.error("Failed to save loan:", dbError);
      setError('Failed to save loan. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loanForm}>
      
      {error && <p className={styles.formError}>{error}</p>}

      {/* --- Form Fields --- */}
      <div className={styles.formGroup}>
        <label htmlFor="lenderName">Lender Name</label>
        <input
          id="lenderName"
          type="text"
          value={lenderName}
          onChange={(e) => setLenderName(e.target.value)}
          placeholder="e.g., Mom"
        />
      </div>

      <div className={styles.formRow}>
        <div className={`${styles.formGroup} ${styles.grow}`}>
          <label htmlFor="principal">Principal Amount</label>
          <input
            id="principal"
            type="number"
            step="0.01"
            min="0"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g., 50000"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="currency">Currency</label>
          <select 
            id="currency" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="CAD">CAD</option>
            {/* Add other currencies as needed */}
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="yearlyRate">Yearly Interest Rate (%)</label>
          <input
            id="yearlyRate"
            type="number"
            step="0.01"
            min="0"
            value={yearlyRate}
            onChange={(e) => setYearlyRate(e.target.value)}
            placeholder="e.g., 4"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., For house down payment"
        />
      </div>

      {/* Form Actions */}
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Save Loan
        </button>
        <button 
          type="button" 
          className={styles.cancelButton}
          // 5. Call onClose() on cancel
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LoanForm;