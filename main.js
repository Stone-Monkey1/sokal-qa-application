const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater"); // ✅ Correct Import
const log = require("electron-log");
const { exec } = require("child_process");
const path = require("path");

let mainWindow;
let backendProcess;
let frontendProcess;

// Log auto-updater events
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

// Auto-updater event listeners
autoUpdater.on("update-available", () => {
  log.info("🔄 Update available! Downloading...");
  dialog.showMessageBox({
    type: "info",
    title: "Update Available",
    message: "A new version is available. Downloading now...",
  });
});

autoUpdater.on("update-downloaded", () => {
  log.info("✅ Update downloaded! Prompting user...");
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Ready",
      message: "Install and restart now?",
      buttons: ["Yes", "Later"],
    })
    .then((response) => {
      if (response.response === 0) {
        log.info("🔄 Installing update and restarting...");
        autoUpdater.quitAndInstall();
      }
    });
});

// Function to check for updates
function checkForUpdates() {
  log.info("🔄 Checking for updates...");

  // ✅ Fix: Check updates differently in development mode
  if (!app.isPackaged) {
    log.info("⚠️ Skipping updates in development mode.");
    return;
  }

  autoUpdater
    .checkForUpdatesAndNotify()
    .then((result) => log.info("🔄 Update check result:", result))
    .catch((error) => log.error("⚠️ Update check failed:", error));
}

// Start backend
function startBackend() {
  log.info("🚀 Starting backend server...");
  const backendPath = path.join(__dirname, "backend", "server.js");
  backendProcess = exec(`node ${backendPath}`);

  backendProcess.stdout.on("data", (data) => log.info(`Backend: ${data}`));
  backendProcess.stderr.on("data", (data) =>
    log.error(`Backend Error: ${data}`)
  );
  backendProcess.on("exit", (code) =>
    log.error(`❌ Backend process exited with code: ${code}`)
  );
}

// Start frontend
function startFrontend() {
  log.info("🚀 Starting frontend server...");
  frontendProcess = exec("cd frontend && npm run serve");
  frontendProcess.stdout.on("data", (data) => {
    log.info(`Frontend: ${data}`);
    // Detect when the frontend has successfully started
    if (data.includes("Local: http://localhost:8080")) {
      log.info("✅ Frontend is now running!");
      createWindow(); // Ensure the window is only created when frontend is ready
    }
  });
  frontendProcess.stderr.on("data", (data) => {
    log.error(`Frontend Error: ${data}`);
  });

  frontendProcess.on("exit", (code) => {
    log.error(`❌ Frontend process exited with code: ${code}`);
  });
}

// Create Electron window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  log.info("⌛ Waiting for frontend to be available...");

  // Keep checking if frontend is available before loading Electron window
  const checkFrontend = setInterval(() => {
    require("http")
      .get("http://localhost:8080", (res) => {
        if (res.statusCode === 200) {
          clearInterval(checkFrontend);
          log.info("✅ Frontend is available! Loading into Electron...");
          mainWindow.loadURL("http://localhost:8080");
        }
      })
      .on("error", () => {
        log.info("⌛ Waiting for frontend...");
      });
  }, 1000); // Check every second
}

// Start the app
app.whenReady().then(async () => {
  log.info("🔄 App is ready. Checking for updates...");
  checkForUpdates(); // ✅ Ensures app checks for updates only when packaged

  log.info("🚀 Starting backend...");
  startBackend();

  // Wait for backend to be available
  log.info("⌛ Waiting for backend to be available...");
  await new Promise((resolve) => {
    let attempts = 0;
    const checkInterval = setInterval(() => {
      if (attempts > 10) {
        log.error("❌ Backend did not start after 10 seconds. Proceeding...");
        clearInterval(checkInterval);
        resolve();
      }
      const net = require("net");
      const client = new net.Socket();
      client
        .connect(3000, "127.0.0.1", () => {
          log.info("✅ Backend is now running!");
          clearInterval(checkInterval);
          client.destroy();
          resolve();
        })
        .on("error", () => {
          log.info("⌛ Waiting for backend...");
          attempts++;
        });
    }, 1000);
  });

  log.info("✅ Backend check complete. Starting frontend...");
  startFrontend();

  log.info("🖥️ Creating Electron window...");
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
