// src/db/index.js
import Dexie from "dexie";

// 1. Initialize the database
export const db = new Dexie("HouseholdLoanerDB");

// 2. Define the database schema (tables and indexes)
db.version(1).stores({
  // loans: '++id, lenderName, principal, yearlyRate, startDate'
  // ++id = Auto-incrementing primary key
  // The other fields are "indexed" for faster queries.
  loans: `
    ++id,
    lenderName,
    principal,
    yearlyRate,
    startDate,
    currency,
    description
  `,

  // payments: '++id, loanId, paymentDate'
  // 'loanId' is our "foreign key" to link to the 'loans' table.
  // We index it to quickly find all payments for a specific loan.
  payments: `
    ++id,
    loanId,
    paymentDate,
    paymentAmount
  `,
});
