/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { LoanProvider } from './LoanContext.jsx'; // Import data provider
import { CurrencyProvider } from './CurrencyContext.jsx'; // Import currency provider

// 1. Create the main app context
const AppContext = createContext();

// 2. Create a custom hook for easy access
export const useAppState = () => {
  return useContext(AppContext);
};

// 3. Create the Provider component
export const AppProvider = ({ children }) => {

  // We can add other app-wide state here later
  // (e.g., error modals, theme)

  const value = {
    // app-wide state and functions go here
  };

  return (
    <AppContext.Provider value={value}>
      {/*
        We compose all our providers here.
        Any component can now access LoanContext (useLoans)
        or CurrencyContext (useCurrency) as needed.
      */}
      <CurrencyProvider>
        <LoanProvider>
          {children}
        </LoanProvider>
      </CurrencyProvider>
    </AppContext.Provider>
  );
};