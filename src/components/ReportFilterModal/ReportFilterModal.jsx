// src/components/ReportFilterModal/ReportFilterModal.jsx
import React, { useState, useMemo } from 'react';
import { useLoans } from '../../context/LoanContext';
import { generateReportHTML } from '../../utils/generateReportHTML.js';
// --- NEW: Import detailed report generator and DB functions ---
import { generateLoanDetailReportHTML } from '../../utils/generateLoanDetailReportHTML.js';
import { getPaymentsForLoan } from '../../db/payments.js';
import { calculateMonthlyAmortization } from '../../db/calculations.js';
// --- END NEW ---
import styles from './ReportFilterModal.module.css';

// Initial state for all our new filters
const initialState = {
  lender: 'ALL',
  balanceMin: '',
  balanceMax: '',
  paymentsMin: '',
  paymentsMax: '',
  monthsMin: '',
  monthsMax: '',
  dateFrom: '',
  dateTo: '',
};

/**
 * A modal for filtering and generating the summary PDF report.
 * @param {object} props
 * @param {Function} props.onClose - The function to close the modal.
 */
const ReportFilterModal = ({ onClose }) => {
  const { loansWithBalances } = useLoans();
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState(initialState);
  // --- NEW: State for report type ---
  const [reportType, setReportType] = useState('summary'); // 'summary' or 'detailed'

  // Get unique lenders for the dropdown
  const uniqueLenders = useMemo(() => {
    const lenders = new Set(loansWithBalances.map((l) => l.lenderName));
    return ['ALL', ...Array.from(lenders).sort()];
  }, [loansWithBalances]);

  // A single handler to update our filter state object
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles filtering the loans, recalculating totals,
   * and generating the PDF.
   */
  const handleGenerate = async () => {
    setIsGenerating(true);

    // 1. Parse all filter values
    const lender = filters.lender;
    const balanceMin = parseFloat(filters.balanceMin) || 0;
    const balanceMax = parseFloat(filters.balanceMax) || Infinity;
    const paymentsMin = parseFloat(filters.paymentsMin) || 0;
    const paymentsMax = parseFloat(filters.paymentsMax) || Infinity;
    const monthsMin = parseFloat(filters.monthsMin) || 0;
    const monthsMax = parseFloat(filters.monthsMax) || Infinity;
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    // 2. Filter the loans based on all criteria
    const filteredLoans = loansWithBalances.filter((loan) => {
      const lenderMatch = lender === 'ALL' || loan.lenderName === lender;
      const balanceMatch =
        loan.currentBalance >= balanceMin && loan.currentBalance <= balanceMax;
      const paymentsMatch =
        loan.totalPayments >= paymentsMin && loan.totalPayments <= paymentsMax;
      const monthsMatch =
        loan.monthsElapsed >= monthsMin && loan.monthsElapsed <= monthsMax;
      
      // Parse loan start date (handling local date string)
      const parts = loan.startDate.split('-');
      const loanStartDate = new Date(parts[0], parts[1] - 1, parts[2]);

      const dateFromMatch = !dateFrom || loanStartDate >= dateFrom;
      const dateToMatch = !dateTo || loanStartDate <= dateTo;

      return (
        lenderMatch &&
        balanceMatch &&
        paymentsMatch &&
        monthsMatch &&
        dateFromMatch &&
        dateToMatch
      );
    });

    // 3. Recalculate summaries based *only* on the filtered loans
    const summary = filteredLoans.reduce(
      (acc, loan) => {
        acc.grandTotalPayments += loan.totalPayments;
        acc.grandTotalCurrentInterest += loan.nextMonthInterest;
        acc.totalCurrentBalance += loan.currentBalance;
        acc.totalPrincipal += loan.principal;
        return acc;
      },
      {
        grandTotalPayments: 0,
        grandTotalCurrentInterest: 0,
        totalCurrentBalance: 0,
        totalPrincipal: 0,
      }
    );

    // 4. Generate HTML based on Report Type
    let htmlContent = '';
    const summaryHtml = generateReportHTML(filteredLoans, summary);
    
    if (reportType === 'summary') {
      htmlContent = summaryHtml;
    } else {
      // Detailed Report: Summary + All Individual Reports
      const detailHtmlParts = [];
      for (const loan of filteredLoans) {
        // We must fetch the full schedule data for each loan
        // (This data is not in LoanContext, we must get it from the DB)
        const payments = await getPaymentsForLoan(loan.id);
        const schedule = calculateMonthlyAmortization(loan, payments);
        const currentBalance = loan.currentBalance; // We already have this
        
        // Use the detailed generator for each loan
        const detailHtml = generateLoanDetailReportHTML(loan, schedule, currentBalance);
        detailHtmlParts.push(detailHtml);
      }
      
      // Join summary + all detail pages, separated by a page break
      htmlContent = summaryHtml + 
        '<div class="page-break"></div>' + 
        detailHtmlParts.join('<div class="page-break"></div>');
    }

    // 5. Call Electron API
    try {
      const result = await window.electronAPI.generatePDF(htmlContent);
      if (result.success) {
        console.log(`Report saved to: ${result.filePath}`);
      } else {
        console.warn(`Report save failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error invoking PDF generation:', error);
    } finally {
      setIsGenerating(false);
      onClose(); // Close modal after generation
    }
  };

  return (
    <div className={styles.modalContainer}>
      <h2 className={styles.title}>Generate Filtered Report</h2>
      <p className={styles.subtitle}>
        Select criteria to include in the report. Leave fields blank to include all.
      </p>

      {/* --- Lender (Dropdown) --- */}
      <div className={styles.formGroup}>
        <label htmlFor="lender">Lender</label>
        <select id="lender" name="lender" value={filters.lender} onChange={handleFilterChange}>
          {uniqueLenders.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* --- Current Balance (Range) --- */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="balanceMin">Min Current Balance</label>
          <input
            id="balanceMin"
            name="balanceMin"
            type="number"
            min="0"
            placeholder="0"
            value={filters.balanceMin}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="balanceMax">Max Current Balance</label>
          <input
            id="balanceMax"
            name="balanceMax"
            type="number"
            min="0"
            placeholder="No limit"
            value={filters.balanceMax}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* --- Total Payments (Range) --- */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="paymentsMin">Min Total Payments</label>
          <input
            id="paymentsMin"
            name="paymentsMin"
            type="number"
            min="0"
            placeholder="0"
            value={filters.paymentsMin}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="paymentsMax">Max Total Payments</label>
          <input
            id="paymentsMax"
            name="paymentsMax"
            type="number"
            min="0"
            placeholder="No limit"
            value={filters.paymentsMax}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* --- Months Elapsed (Range) --- */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="monthsMin">Min Months Elapsed</label>
          <input
            id="monthsMin"
            name="monthsMin"
            type="number"
            min="0"
            placeholder="0"
            value={filters.monthsMin}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="monthsMax">Max Months Elapsed</label>
          <input
            id="monthsMax"
            name="monthsMax"
            type="number"
            min="0"
            placeholder="No limit"
            value={filters.monthsMax}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* --- Start Date (Range) --- */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="dateFrom">Start Date From</label>
          <input
            id="dateFrom"
            name="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dateTo">Start Date To</label>
          <input
            id="dateTo"
            name="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* --- NEW: Report Type Toggle --- */}
      <div className={styles.toggleGroup}>
        <span className={styles.toggleLabel}>
          {reportType === 'summary' ? 'Report Type: Summary' : 'Report Type: Detailed'}
        </span>
        <label className={styles.toggleSwitch}>
          <input 
            type="checkbox" 
            checked={reportType === 'detailed'}
            onChange={(e) => setReportType(e.target.checked ? 'detailed' : 'summary')}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
      {/* --- END NEW --- */}

      {/* --- Actions --- */}
      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.submitButton}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportFilterModal;