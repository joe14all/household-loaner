/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';

// 1. Create the context
const CurrencyContext = createContext();

// 2. Create a custom hook for easy access
export const useCurrency = () => {
  return useContext(CurrencyContext);
};

// 3. Create the Provider component
export const CurrencyProvider = ({ children }) => {

  /**
   * A global function to format currency.
   * It respects the currency code stored on the loan.
   * Defaults to USD if no currency is provided.
   */
  const formatCurrency = (amount, currencyCode = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (err) {
      // Fallback for invalid currency code
      console.warn(`Invalid currency code: ${currencyCode}. Defaulting to USD.`);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
  };

  const value = {
    formatCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};