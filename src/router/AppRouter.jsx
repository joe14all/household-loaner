import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all our Page components
import DashboardPage from '../pages/DashboardPage/DashboardPage.jsx';
import LoanDetailPage from '../pages/LoanDetailPage/LoanDetailPage.jsx';
import AddLoanPage from '../pages/AddLoanPage/AddLoanPage.jsx';

/**
 * Central hub for all application routes.
 * This component is rendered by App.jsx
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Route 1: The Dashboard (homepage) */}
      <Route 
        path="/" 
        element={<DashboardPage />} 
      />
      
      {/* Route 2: The Loan Detail Page */}
      <Route 
        path="/loan/:id" 
        element={<LoanDetailPage />} 
      />

      {/* Route 3: The "Add New Loan" Page */}
      <Route 
        path="/add-loan" 
        element={<AddLoanPage />} 
      />

      {/* Future routes (like Settings, etc.) would go here.
        <Route path="/settings" element={<SettingsPage />} /> 
      */}
    </Routes>
  );
};

export default AppRouter;