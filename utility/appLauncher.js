const { exec, spawn } = require("child_process");
const path = require("path");
const log = require("electron-log");
const { app, BrowserWindow } = require("electron");

let _backendProcess = null;
let _frontendProcess = null;
let mainWindow = null;

function startBackend() {
  log.info("🚀 Starting backend server...");

  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, "backend", "server.js")
    : path.join(__dirname, "..", "backend", "server.js");

  const nodePath = app.isPackaged
    ? path.join(process.resourcesPath, "node-bin", "node")
    : "node";

  log.info(`📌 Backend path: ${backendPath}`);
  log.info(`📌 Node path: ${nodePath}`);

  _backendProcess = spawn(nodePath, [backendPath], {
    stdio: ["ignore", "pipe", "pipe"], // or ['pipe', 'pipe', 'pipe'] if you want logging
    detached: false, // ← explicitly make sure it's not detached
  });
  _backendProcess.on("exit", (code, signal) => {
    log.info(`💀 Backend process exited with code ${code}, signal ${signal}`);
    _backendProcess = null;
  });
  

  log.info(`🧠 Backend process started with PID: ${_backendProcess.pid}`);
}

function startFrontend() {
  log.info("🚀 Starting frontend server...");
  if (app.isPackaged) {
    log.info("✅ Skipping frontend server in production.");
    return;
  }

  _frontendProcess = exec("cd frontend && npm run serve");
}

function createWindow() {
  if (mainWindow) {
    log.info("🖥️ Main window already exists. Skipping re-creation.");
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const url = app.isPackaged
    ? `file://${path.join(__dirname, "..", "docs", "index.html")}`
    : "http://localhost:8080";

  log.info(`📌 Loading frontend from ${url}`);
  mainWindow.loadURL(url);
}

// Export accessors instead of raw variables
function getBackendProcess() {
  return _backendProcess;
}

function getFrontendProcess() {
  return _frontendProcess;
}

function getBackendProcess() {
  return _backendProcess;
}

function getFrontendProcess() {
  return _frontendProcess;
}

function getMainWindow() {
  return mainWindow;
}

module.exports = {
  startBackend,
  startFrontend,
  createWindow,
  getBackendProcess,
  getFrontendProcess,
  getMainWindow,
};
