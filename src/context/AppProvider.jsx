/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { LoanProvider } from './LoanContext.jsx'; 
import { CurrencyProvider } from './CurrencyContext.jsx'; 
// 1. Import the new ModalProvider
import { ModalProvider } from './ModalContext.jsx';

// Note: We've removed AppContext and useAppState from this file,
// as this component's only job is to compose other providers.

/**
 * The main AppProvider. It composes all other contexts for the app.
 */
export const AppProvider = ({ children }) => {
  
  // 2. All modal state and functions have been moved to ModalContext.

  // 3. Nest the new ModalProvider inside the composition.
  return (
    <CurrencyProvider>
      <LoanProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </LoanProvider>
    </CurrencyProvider>
  );
};