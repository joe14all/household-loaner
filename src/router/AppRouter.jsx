import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Remove AddLoanPage import
import DashboardPage from '../pages/DashboardPage/DashboardPage.jsx';
import LoanDetailPage from '../pages/LoanDetailPage/LoanDetailPage.jsx';

/**
 * Central hub for all application routes.
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

      {/* 2. Removed the /add-loan route */}

    </Routes>
  );
};

export default AppRouter;