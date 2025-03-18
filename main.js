const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater"); // ✅ Correct Import
const log = require("electron-log");
const { exec } = require("child_process");
const path = require("path");

const gotTheLock = app.requestSingleInstanceLock();

process.env.NODE_ENV = app.isPackaged ? "production" : "development";

let mainWindow;
let backendProcess;
let frontendProcess;

if (!gotTheLock) {
  app.quit();
  return;
}

app.on("second-instance", () => {
  // If a second instance is opened, focus the existing window
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Log auto-updater events
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

// Auto-updater event listeners
autoUpdater.on("update-available", () => {
  log.info("Update available! Downloading...");
  dialog.showMessageBox({
    type: "info",
    title: "Update Available",
    message: "A new version is available. Downloading now...",
  });
});

autoUpdater.on("update-downloaded", () => {
  log.info("Update downloaded! Prompting user...");
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Ready",
      message: "Install and restart now?",
      buttons: ["Yes", "Later"],
    })
    .then((response) => {
      if (response.response === 0) {
        log.info("Installing update and restarting...");
        autoUpdater.quitAndInstall();
      }
    });
});

// Function to check for updates
function checkForUpdates() {
  log.info("🔄 Checking for updates...");

  // Fix: Check updates differently in development mode
  if (!app.isPackaged) {
    log.info("Skipping updates in development mode.");
    return;
  }

  autoUpdater
    .checkForUpdatesAndNotify()
    .then((result) => log.info("Update check result:", result))
    .catch((error) => log.error("Update check failed:", error));
}

// Start backend
function startBackend() {
  log.info("🚀 Starting backend server...");

  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, "app", "backend", "server.js")
    : path.join(__dirname, "backend", "server.js");

  const nodePath = app.isPackaged
    ? path.join(process.resourcesPath,"app", "node-bin", "node") // ✅ Use packaged Node binary
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
    return; // ✅ Prevents multiple instances
  }

  log.info("🖥️ Creating Electron window...");
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allows local file access
    },
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (app.isPackaged) {
    const indexPath = `file://${path.join(
      process.resourcesPath,
      "app",
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

log.info("⌛ Waiting for frontend to be available...");

// Keep checking if frontend is available before loading Electron window
if (!app.isPackaged) {
  log.info("⌛ Waiting for frontend to be available...");

  const checkFrontend = setInterval(() => {
    require("http")
      .get("http://localhost:8080", (res) => {
        if (res.statusCode === 200) {
          clearInterval(checkFrontend);
          log.info("Frontend is available! Loading into Electron...");
          if (mainWindow) {
            mainWindow.loadURL("http://localhost:8080");
          } else {
            log.error(
              "Attempted to load frontend but mainWindow is undefined."
            );
          }
        }
      })
      .on("error", () => {
        log.info("⌛ Waiting for frontend...");
      });
  }, 1000);
} else {
  log.info("✅ Skipping frontend availability check in production.");
}

// Start the app
app.whenReady().then(async () => {
  log.info("App is ready. Checking for updates...");
  checkForUpdates();

  log.info("Starting backend...");
  startBackend();

  log.info("Waiting for backend to be available...");
  await new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 15; // Limit retries
    const checkInterval = setInterval(() => {
      if (attempts >= maxAttempts) {
        log.error("Backend did not start after 15 seconds. Skipping.");
        clearInterval(checkInterval);
        resolve();
      }
      const net = require("net");
      const client = new net.Socket();
      client
        .connect(3000, "127.0.0.1", () => {
          log.info("Backend is now running!");
          clearInterval(checkInterval);
          client.destroy();
          resolve();
        })
        .on("error", () => {
          log.info("Waiting for backend...");
          attempts++;
        });
    }, 1000);
  });

  log.info("Backend check complete. Starting frontend...");
  startFrontend();

  log.info("Creating Electron window...");
  createWindow();
});

// Close Processes on App Exit
app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
