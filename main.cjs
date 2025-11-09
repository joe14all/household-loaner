// main.cjs
const { app, BrowserWindow, ipcMain, dialog } = require("electron"); // 1. Add ipcMain and dialog
const path = require("path");
const fs = require("fs");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // __dirname is the current directory (root of the project)
      // preload.js will be created next
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  // Load the React app.
  // In development, we load from the Vite dev server.
  // In production, we load the built 'index.html' file.
  if (app.isPackaged) {
    // 'build' is the default output folder for 'npm run build'
    mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:5173");
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
}

/**
 * Handles the 'generate-pdf' request from the React app.
 */
ipcMain.handle("generate-pdf", async (event, htmlContent) => {
  // 1. Get the window that sent the request
  const window = BrowserWindow.getFocusedWindow();

  // 2. Show the "Save As..." dialog
  const { canceled, filePath } = await dialog.showSaveDialog(window, {
    title: "Save Report as PDF",
    defaultPath: `household-loans-report-${
      new Date().toISOString().split("T")[0]
    }.pdf`,
    filters: [{ name: "PDF Documents", extensions: ["pdf"] }],
  });

  if (canceled || !filePath) {
    return { success: false, error: "Save was canceled." };
  }

  // 3. Generate the PDF from the HTML
  try {
    // --- FIX START: Correct PDF Generation ---
    // We create a new, hidden window to load our HTML into.
    const pdfWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        contextIsolation: false, // Keep it simple for loading string content
      },
    });

    // Load the HTML content from React as a data URL
    await pdfWindow.loadURL(
      `data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`
    );

    // Print *this hidden window's* contents to PDF
    const pdfData = await pdfWindow.webContents.printToPDF({
      marginsType: 0,
      printBackground: true,
      pageSize: "A4",
    });

    // Close the hidden window
    pdfWindow.close();
    // --- FIX END ---

    // 4. Write the file to disk
    fs.writeFileSync(filePath, pdfData);

    return { success: true, filePath };
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    return { success: false, error: error.message };
  }
});
// --- END NEW BLOCK ---

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
