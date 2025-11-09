import React, { useState } from 'react';
import styles from './PaymentManager.module.css';
import { useCurrency } from '../../../context/CurrencyContext';
import { addPayment, deletePayment } from '../../../db/payments';

/**
 * Helper to get today's date in YYYY-MM-DD format for the input default
 */
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * A component to add new payments and list/delete existing ones.
 *
 * @param {object} props
 * @param {number} props.loanId - The ID of the current loan.
 * @param {string} props.currency - The currency of the loan.
 * @param {Array} props.payments - The raw array of payment objects.
 * @param {Function} props.refreshData - The function from useLoanDetails to refetch all data.
 */
const PaymentManager = ({ loanId, currency, payments, refreshData }) => {
  const { formatCurrency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState('');

  /**
   * Handles submission of the new payment form.
   */
  const handleAddPayment = async (e) => {
    e.preventDefault();
    setError('');
    const paymentAmount = parseFloat(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError('Payment amount must be a positive number.');
      return;
    }
    if (!date) {
      setError('Please select a valid date.');
      return;
    }

    try {
      // 1. Add the payment to the database
      await addPayment(loanId, date, paymentAmount);
      
      // 2. Trigger a full refresh of the page's data
      await refreshData();
      
      // 3. Clear the form
      setAmount('');
      setDate(getTodayString());
    } catch (dbError) {
      console.error("Failed to add payment:", dbError);
      setError('Failed to save payment. Please try again.');
    }
  };

  /**
   * Handles deleting a specific payment.
   */
  const handleDeletePayment = async (paymentId) => {
    try {
      // 1. Delete the payment from the database
      await deletePayment(paymentId);
      
      // 2. Trigger a full refresh
      await refreshData();
    } catch (dbError) {
      console.error("Failed to delete payment:", dbError);
      setError('Failed to delete payment. Please try again.');
    }
  };
  
  /**
   * Helper to parse a YYYY-MM-DD string as a local date
   */
  const getLocalDateString = (dateString) => {
    if (!dateString) return 'N/A';
    const dateParts = dateString.split('-');
    const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return localDate.toLocaleDateString();
  };

  return (
    <div className={styles.managerContainer}>
      
      {/* 1. Add Payment Form */}
      <div className={styles.formContainer}>
        <h3 className={styles.title}>Add New Payment</h3>
        {error && <p className={styles.formError}>{error}</p>}
        <form onSubmit={handleAddPayment} className={styles.paymentForm}>
          <div className={styles.formGroup}>
            <label htmlFor="paymentAmount">Amount</label>
            <input
              id="paymentAmount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 1000"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="paymentDate">Payment Date</label>
            <input
              id="paymentDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.addButton}>Add Payment</button>
        </form>
      </div>

      {/* 2. Payment History List */}
      <div className={styles.listContainer}>
        <h3 className={styles.title}>Payment History</h3>
        {payments.length === 0 ? (
          <p className={styles.emptyList}>No payments made yet.</p>
        ) : (
          <ul className={styles.paymentList}>
            {payments.map((p) => (
              <li key={p.id} className={styles.paymentItem}>
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentAmount}>
                    {formatCurrency(p.paymentAmount, currency)}
                  </span>
                  <span className={styles.paymentDate}>
                    {getLocalDateString(p.paymentDate)}
                  </span>
                </div>
                <button 
                  onClick={() => handleDeletePayment(p.id)}
                  className={styles.deleteButton}
                  title="Delete this payment"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PaymentManager;