// src/db/loans.js
import { db } from "./index.js";

/**
 * Adds a new loan to the database.
 * @param {object} loanData - The loan data (lenderName, principal, etc.)
 * @returns {Promise<number>} The ID of the new loan.
 */
export const addNewLoan = (loanData) => {
  // Dexie handles data validation, but you can add your own here
  const {
    lenderName,
    principal,
    yearlyRate,
    startDate,
    currency,
    description,
  } = loanData;
  return db.loans.add({
    lenderName,
    principal,
    yearlyRate,
    startDate,
    currency,
    description,
  });
};

/**
 * Fetches all loans from the database, ordered by start date.
 * @returns {Promise<Array>} A promise that resolves to an array of all loans.
 */
export const getAllLoans = () => {
  return db.loans.orderBy("startDate").toArray();
};

/**
 * Fetches a single loan by its ID.
 * @param {number} id - The primary key of the loan.
 * @returns {Promise<object>} A promise that resolves to the loan object.
 */
export const getLoanById = (id) => {
  return db.loans.get(id);
};

/**
 * Updates an existing loan.
 * @param {number} id - The primary key of the loan to update.
 * @param {object} loanData - The new loan data.
 * @returns {Promise<number>} The number of items updated (should be 1).
 */
export const updateLoan = (id, loanData) => {
  return db.loans.update(id, loanData);
};

/**
 * Deletes a loan AND all its associated payments.
 * @param {number} loanId - The ID of the loan to delete.
 */
export const deleteLoan = (loanId) => {
  // Use a transaction to ensure both operations succeed or fail together
  return db.transaction("rw", db.loans, db.payments, async () => {
    // 1. Delete all payments for this loan
    await db.payments.where("loanId").equals(loanId).delete();

    // 2. Delete the loan itself
    await db.loans.delete(loanId);
  });
};
