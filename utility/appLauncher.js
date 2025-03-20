const { app, BrowserWindow } = require("electron");
const log = require("electron-log");
const { exec } = require("child_process");
const path = require("path");

let mainWindow;
let backendProcess;
let frontendProcess;

// Start backend
function startBackend() {
  log.info("🚀 Starting backend server...");

  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, "backend", "server.js")
    : path.join(__dirname, "..", "backend", "server.js"); // Adjusted for correct relative path

  const nodePath = app.isPackaged
    ? path.join(process.resourcesPath, "node-bin", "node")
    : "node"; // Use system Node.js in development

  log.info(`📌 Backend path: ${backendPath}`);
  log.info(`📌 Node path: ${nodePath}`);

  backendProcess = exec(
    `"${nodePath}" "${backendPath}"`,
    (error, stdout, stderr) => {
      if (error) {
        log.error(`❌ Backend Error: ${error.message}`);
        return;
      }
      if (stderr) {
        log.error(`Backend stderr: ${stderr}`);
        return;
      }
      log.info(`Backend stdout: ${stdout}`);
    }
  );

  backendProcess.stdout.on("data", (data) => log.info(`Backend: ${data}`));
  backendProcess.stderr.on("data", (data) =>
    log.error(`Backend Error: ${data}`)
  );
}

// Start frontend
function startFrontend() {
  log.info("🚀 Starting frontend server...");
  if (app.isPackaged) {
    log.info("✅ Skipping frontend server in production.");
    return;
  }
  frontendProcess = exec("cd frontend && npm run serve");
}

// Create Electron window
function createWindow() {
  if (mainWindow) {
    log.info("🖥️ Main window already exists. Skipping re-creation.");
    return;
  }

  log.info("🖥️ Creating Electron window...");
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

  if (app.isPackaged) {
    const indexPath = `file://${path.join(
      __dirname,
      "..",
      "docs",
      "index.html"
    )}`;
    log.info(`📌 Loading frontend from ${indexPath}`);
    mainWindow.loadURL(indexPath);
  } else {
    log.info("🚀 Loading frontend from localhost:8080");
    mainWindow.loadURL("http://localhost:8080");
  }
}

module.exports = {
  startBackend,
  startFrontend,
  createWindow,
  backendProcess,
  frontendProcess,
  mainWindow,
};
