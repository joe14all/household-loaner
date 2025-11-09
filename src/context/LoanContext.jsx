/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllLoans } from '../db/loans.js';

// 1. Create the context
const LoanContext = createContext();

// 2. Create a custom hook for easy access
export const useLoans = () => {
  return useContext(LoanContext);
};

// 3. Create the Provider component (this will wrap our app)
export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // We use useCallback to create a stable function
  // that our components can call to refresh the loan list
  const refreshLoans = useCallback(async () => {
    try {
      setIsLoading(true);
      const allLoans = await getAllLoans();
      setLoans(allLoans);
    } catch (err) {
      console.error("Failed to fetch loans:", err);
      // You could add an error state here
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On initial app load, fetch the loans
  useEffect(() => {
    refreshLoans();
  }, [refreshLoans]); // The function is stable, so this only runs once

  // The "value" is what all child components will get
  const value = {
    loans,
    isLoading,
    refreshLoans,
  };

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
};