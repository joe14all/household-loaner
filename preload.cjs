// preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // --- ADD THIS FUNCTION ---
  /**
   * Invokes the 'generate-pdf' channel in the main process.
   * @param {string} htmlContent The complete HTML string to print to PDF.
   * @returns {Promise<object>} A promise that resolves with { success: true, filePath: '...' } or { success: false, error: '...' }
   */
  generatePDF: (htmlContent) => ipcRenderer.invoke("generate-pdf", htmlContent),
  // --- END ---
});
