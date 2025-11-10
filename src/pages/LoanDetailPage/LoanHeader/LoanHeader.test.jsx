// src/pages/LoanDetailPage/LoanHeader/LoanHeader.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import LoanHeader from './LoanHeader.jsx';
import { CurrencyProvider } from '../../../context/CurrencyContext.jsx';

// A mock loan object for testing
const mockLoan = {
  lenderName: 'Test Bank',
  description: 'A loan for testing',
  principal: 50000,
  yearlyRate: 0.05,
  startDate: '2023-01-01',
  currency: 'USD',
};

describe('LoanHeader', () => {
  it('should render all loan details correctly', () => {
    // ARRANGE
    // We must wrap the component in any
    // Context Providers it depends on.
    render(
      <CurrencyProvider>
        <LoanHeader loan={mockLoan} currentBalance={45000} />
      </CurrencyProvider>
    );

    // ACT & ASSERT
    // We check if the text is visible on the "screen"
    expect(screen.getByText('Loan from Test Bank')).toBeInTheDocument();
    expect(screen.getByText('A loan for testing')).toBeInTheDocument();

    // Check for the formatted values
    expect(screen.getByText('$45,000.00')).toBeInTheDocument(); // Current Balance
    expect(screen.getByText('$50,000.00')).toBeInTheDocument(); // Principal
    expect(screen.getByText('5.00%')).toBeInTheDocument();     // Rate
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();   // Start Date
  });
});