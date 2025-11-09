/* This file exports our CSS as a string.
  We will inject this <style> tag into the PDF's HTML
  to ensure it's styled correctly.
*/
export const reportStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 13px; /* Increased base font size for readability */
    line-height: 1.6;
    color: #1d1d1f; /* Apple's primary text color */
    margin: 40px; /* More breathing room */
    -webkit-font-smoothing: antialiased;
  }

  header {
    margin-bottom: 32px;
  }

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: #1d1d1f;
    border-bottom: none; /* Removed old border */
    padding-bottom: 0;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 16px;
    color: #6e6e73; /* Apple's secondary text color */
    margin: 0;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1d1d1f;
    border-bottom: 1px solid #e5e5e5; /* Lighter, cleaner separator */
    padding-bottom: 8px;
    margin-top: 32px;
    margin-bottom: 16px;
  }

  table {
    width: 100%;
    border-spacing: 0; /* Replaces border-collapse */
    margin-top: 16px;
  }

  th, td {
    border: none; /* Removed all cell borders */
    border-bottom: 1px solid #e5e5e5; /* Clean horizontal lines */
    padding: 12px 16px; /* Increased padding */
    text-align: left;
    white-space: nowrap;
  }

  th {
    background-color: transparent; /* Cleaner than a gray bg */
    font-weight: 500;
    font-size: 12px;
    color: #6e6e73;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  /* Remove border from the last row for a clean finish */
  tbody tr:last-child td {
    border-bottom: none;
  }

  td {
    color: #1d1d1f;
  }

  /* --- UPDATE: Align numeric headers too --- */
  th.numeric,
  td.numeric {
    text-align: right;
    font-family: 'SF Mono', 'Menlo', 'Courier New', monospace;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px; /* Increased gap */
    margin-bottom: 20px;
  }

  /* --- NEW: Grid for the 4-box loan summary --- */
  .loan-header-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  /* --- END NEW --- */

  .stat-box {
    border: none; /* Removed border */
    background-color: #f5f5f7; /* Apple's light UI gray */
    border-radius: 12px; /* Softer, more modern radius */
    padding: 20px;
    /* --- NEW: Ensure boxes can grow --- */
    display: flex;
    flex-direction: column;
    /* --- END NEW --- */
  }

  .stat-label {
    font-size: 13px;
    font-weight: 500;
    color: #6e6e73;
    margin-bottom: 8px;
    display: block;
    text-transform: none; /* Calmer than uppercase */
  }

  .stat-value {
    font-size: 22px;
    font-weight: 600;
    font-family: 'SF Mono', 'Menlo', 'Courier New', monospace;
    line-height: 1.2;
  }
  
  /* --- NEW STYLES FOR BREAKDOWN --- */
  .stat-breakdown {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #d2d2d7; /* Slightly darker than light gray */
  }
  .stat-breakdown div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  .stat-breakdown div:last-child {
    margin-bottom: 0;
  }
  .breakdown-label {
    font-size: 13px;
    font-weight: 500;
    color: #6e6e73;
  }
  .breakdown-value {
    font-size: 13px;
    font-weight: 500;
    font-family: 'SF Mono', 'Menlo', 'Courier New', monospace;
    color: #1d1d1f;
  }
  .interest-value {
    color: #ff9500; /* Apple's orange */
    font-weight: 600;
  }
  /* --- END NEW STYLES --- */

  footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #e5e5e5;
    text-align: center;
    font-size: 11px;
    color: #86868b; /* Apple's tertiary text color */
  }

  /* --- NEW: Page Break for detailed reports --- */
  .page-break {
    page-break-before: always;
  }

  /* Color definitions */
  .positive { color: #34c759; } /* Apple's green */
  .info { color: #007aff; } /* Kept brand blue */
  .brand { color: #007aff; } /* Use brand blue for main balance */
`;
