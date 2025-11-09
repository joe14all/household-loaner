import { useState, useEffect, useCallback } from "react";
import { getLoanById } from "../db/loans";
import { getPaymentsForLoan } from "../db/payments";
import { calculateMonthlyAmortization } from "../db/calculations";

/**
 * A custom hook to fetch all data for a single loan,
 * including the calculated amortization schedule.
 * @param {string} loanId The loan ID from the URL params.
 * @returns {object} { loan, schedule, payments, isLoading, error, refreshData }
 */
export const useLoanDetails = (loanId) => {
  const [loan, setLoan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wrap fetchData in useCallback so it's a stable function
  const fetchData = useCallback(async () => {
    if (!loanId) {
      setIsLoading(false);
      setError("No loan ID provided.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const numericId = parseInt(loanId, 10);
      if (isNaN(numericId)) {
        throw new Error("Invalid loan ID.");
      }

      // 1. Fetch the loan and its payments in parallel
      const [loanData, paymentData] = await Promise.all([
        getLoanById(numericId),
        getPaymentsForLoan(numericId),
      ]);

      if (!loanData) {
        throw new Error("Loan not found.");
      }

      // 2. Run the calculation
      const amortizationSchedule = calculateMonthlyAmortization(
        loanData,
        paymentData
      );

      // 3. Set all states
      setLoan(loanData);
      setPayments(paymentData); // <-- NEW: Save the raw payments
      setSchedule(amortizationSchedule);
    } catch (err) {
      console.error("Failed to fetch loan details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loanId]); // Only recreate this function if the loanId changes

  // Run the fetch function on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Will run once on mount

  // Return all the data AND the refresh function
  return { loan, schedule, payments, isLoading, error, refreshData: fetchData };
};
