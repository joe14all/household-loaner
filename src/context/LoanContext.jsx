/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllLoans } from '../db/loans.js';
import { getPaymentsForLoan } from '../db/payments.js'; // Import payment function
import { calculateMonthlyAmortization } from '../db/calculations.js'; // Import calculation function

// 1. Create the context
const LoanContext = createContext();

// 2. Create a custom hook for easy access
export const useLoans = () => {
  return useContext(LoanContext);
};

// 3. Create the Provider component
export const LoanProvider = ({ children }) => {
  // This state holds the raw loans from the DB
  const [rawLoans, setRawLoans] = useState([]);
  
  // This state will hold the loans *with* their calculated balances
  const [loansWithBalances, setLoansWithBalances] = useState([]);
  
  // These states will hold the grand totals for the footer
  const [totalPrincipal, setTotalPrincipal] = useState(0);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState(0);

  // --- NEW: Add state for our new analytics ---
  const [grandTotalPayments, setGrandTotalPayments] = useState(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState(0);
  const [grandTotalCurrentInterest, setGrandTotalCurrentInterest] = useState(0);
  // --- END NEW STATE ---

  const [isLoading, setIsLoading] = useState(true);

  const refreshLoans = useCallback(async () => {
    try {
      setIsLoading(true);
      const allLoans = await getAllLoans();
      setRawLoans(allLoans);

      let calculatedLoans = [];
      let principalSum = 0;
      let balanceSum = 0;
      // --- NEW: Add accumulators ---
      let paymentSum = 0;
      let currentInterestSum = 0;
      // --- END NEW ACCUMULATORS ---

      for (const loan of allLoans) {
        const payments = await getPaymentsForLoan(loan.id);
        const schedule = calculateMonthlyAmortization(loan, payments);

        const currentBalance = schedule.length > 0 
          ? schedule[schedule.length - 1].closingBalance 
          : loan.principal;

        // --- NEW CALCULATIONS ---

        // 1. Get total months elapsed
        const monthsElapsed = schedule.length;

        // 2. Get total payments made
        const totalPayments = payments.reduce(
          (sum, p) => sum + p.paymentAmount,
          0
        );

        // 3. Calculate next month's potential interest
        const nextMonthInterest = currentBalance * (loan.yearlyRate / 12);

        // --- END NEW CALCULATIONS ---

        calculatedLoans.push({
          ...loan,
          currentBalance: currentBalance,
          monthsElapsed: monthsElapsed,      // <-- ADDED
          totalPayments: totalPayments,      // <-- ADDED
          nextMonthInterest: nextMonthInterest, // <-- ADDED
        });

        // Add to our totals
        principalSum += loan.principal;
        balanceSum += currentBalance;
        // --- NEW: Accumulate new totals ---
        paymentSum += totalPayments;
        currentInterestSum += nextMonthInterest;
        // --- END NEW ACCUMULATORS ---
      }

      // --- NEW: Find the loan with the highest next interest ---
      let maxInterest = -1;
      if (calculatedLoans.length > 0) {
        // Find the highest interest amount
        maxInterest = Math.max(...calculatedLoans.map(l => l.nextMonthInterest));
      }

      // Map again to add the 'isHighestInterest' flag
      const finalCalculatedLoans = calculatedLoans.map(loan => ({
        ...loan,
        // The marker is only true if interest is > 0 and is the max
        isHighestInterest: 
          loan.nextMonthInterest > 0 && 
          loan.nextMonthInterest === maxInterest,
      }));
      // --- END NEW LOGIC ---

      // --- NEW: Calculate final interest paid ---
      // Total Interest Paid = (Total Payments) - (Reduction in Principal)
      // Reduction in Principal = (Total Borrowed) - (Total Owed Now)
      const totalInterestPaidCalc = paymentSum - (principalSum - balanceSum);
      // --- END NEW CALCULATION ---


      // 4. Set all states
      setLoansWithBalances(finalCalculatedLoans); // <-- USE FINAL LIST
      setTotalPrincipal(principalSum);
      setTotalCurrentBalance(balanceSum);
      // --- NEW: Set new analytic states ---
      setGrandTotalPayments(paymentSum);
      setTotalInterestPaid(totalInterestPaidCalc);
      setGrandTotalCurrentInterest(currentInterestSum);
      // --- END NEW STATES ---

    } catch (err) {
      console.error("Failed to fetch and calculate loans:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On initial app load, run the refresh function
  useEffect(() => {
    refreshLoans();
  }, [refreshLoans]);

  // The "value" now provides all the data our components need
  const value = {
    rawLoans, 
    loansWithBalances, 
    totalPrincipal, 
    totalCurrentBalance,
    // --- NEW: Expose new analytics ---
    grandTotalPayments,
    totalInterestPaid,
    grandTotalCurrentInterest,
    // --- END NEW ANALYTICS ---
    isLoading,
    refreshLoans,
  };

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
};