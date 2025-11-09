// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// We are exposing a secure API to the "renderer" process (our React app)
// This is a good practice for security.
// For now, it's empty, but you would add functions here
// to interact with the OS (e.g., save files, show dialogs).
contextBridge.exposeInMainWorld("electronAPI", {
  // Example:
  // showSaveDialog: (data) => ipcRenderer.invoke('dialog:save', data)
});
