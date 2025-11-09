/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
// 1. Import the shared function
import { formatCurrency as formatCurrencyUtil } from '../utils/formatCurrency.js';

// 1. Create the context
const CurrencyContext = createContext();

// 2. Create a custom hook for easy access
export const useCurrency = () => {
  return useContext(CurrencyContext);
};

// 3. Create the Provider component
export const CurrencyProvider = ({ children }) => {
  
  // 2. Use the imported function inside the context provider
  const formatCurrency = (amount, currencyCode = 'USD') => {
    return formatCurrencyUtil(amount, currencyCode);
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