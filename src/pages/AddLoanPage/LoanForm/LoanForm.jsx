import React, { useState } from 'react';
import styles from './LoanForm.module.css';
import { addNewLoan, updateLoan } from '../../../db/loans'; // Import updateLoan
import { useLoans } from '../../../context/LoanContext';

// 2. Accept 'onClose' and 'initialLoan' as props
const LoanForm = ({ onClose, initialLoan }) => {
  const isEditing = !!initialLoan && !!initialLoan.id;

  // State initialization uses initialLoan if available
  const [lenderName, setLenderName] = useState(initialLoan?.lenderName || '');
  // Convert number to string for input value
  const [principal, setPrincipal] = useState(initialLoan?.principal?.toString() || '');
  // Convert decimal rate (0.04) to percentage string (4.00)
  const [yearlyRate, setYearlyRate] = useState(initialLoan?.yearlyRate ? (initialLoan.yearlyRate * 100).toFixed(2) : '');
  const [startDate, setStartDate] = useState(initialLoan?.startDate || '');
  const [currency, setCurrency] = useState(initialLoan?.currency || 'USD');
  const [description, setDescription] = useState(initialLoan?.description || '');
  const [error, setError] = useState('');

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
      // --- Conditional save logic (Add vs. Update) ---
      if (isEditing) {
        // Use updateLoan for existing loan
        await updateLoan(initialLoan.id, loanData);
      } else {
        // Use addNewLoan for new loan
        await addNewLoan(loanData);
      }
      
      await refreshLoans();
      onClose();
      
    } catch (dbError) {
      console.error("Failed to save loan:", dbError);
      setError('Failed to save loan. Please try again.');
    }
  };

  const submitButtonText = isEditing ? 'Save Changes' : 'Save Loan';
  const formTitle = isEditing ? `Edit Loan: ${initialLoan.lenderName}` : 'Add a New Loan';

  return (
    <form onSubmit={handleSubmit} className={styles.loanForm}>
      
      {/* --- NEW: Display Form Title inside the form --- */}
      <h2 className={styles.formHeader}>{formTitle}</h2> 
      
      {error && <p className={styles.formError}>{error}</p>}

      {/* --- Form Fields (remain unchanged, use state variables) --- */}
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
          {submitButtonText}
        </button>
        <button 
          type="button" 
          className={styles.cancelButton}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LoanForm;