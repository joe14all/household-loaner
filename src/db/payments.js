// src/db/payments.js
import { db } from "./index.js";

/**
 * Adds a new payment for a specific loan.
 * @param {number} loanId - The ID of the loan this payment belongs to.
 *a* @param {string} paymentDate - The ISO date string of the payment.
 * @param {number} paymentAmount - The amount of the payment.
 * @returns {Promise<number>} The ID of the new payment.
 */
export const addPayment = (loanId, paymentDate, paymentAmount) => {
  return db.payments.add({
    loanId,
    paymentDate,
    paymentAmount,
  });
};

/**
 * Fetches all payments for a specific loan, ordered by date.
 * @param {number} loanId - The ID of the loan.
 * @returns {Promise<Array>} A promise that resolves to an array of payments.
 */
export const getPaymentsForLoan = (loanId) => {
  return db.payments.where("loanId").equals(loanId).sortBy("paymentDate");
};

/**
 * Deletes a single payment by its ID.
 * @param {number} paymentId - The primary key of the payment.
 */
export const deletePayment = (paymentId) => {
  return db.payments.delete(paymentId);
};
