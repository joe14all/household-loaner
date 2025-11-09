/* This file exports our CSS as a string.
  We will inject this <style> tag into the PDF's HTML
  to ensure it's styled correctly.
*/
export const reportStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 10px;
    line-height: 1.5;
    color: #333;
    margin: 20px;
  }
  h1 {
    font-size: 24px;
    color: #007aff;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 18px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-top: 24px;
    margin-bottom: 12px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f8f9fa;
    font-weight: 600;
  }
  td.numeric {
    text-align: right;
    font-family: 'Menlo', 'Courier New', monospace;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  .stat-box {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
  }
  .stat-label {
    font-size: 10px;
    text-transform: uppercase;
    color: #5c5c5c;
    margin-bottom: 8px;
    display: block;
  }
  .stat-value {
    font-size: 18px;
    font-weight: 600;
    font-family: 'Menlo', 'Courier New', monospace;
  }
  .positive { color: #28a745; }
  .info { color: #17a2b8; }
  .brand { color: #007aff; }
`;
