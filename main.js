const { app, ipcMain } = require("electron");
const log = require("electron-log");
const { checkForUpdates } = require("./utility/updateChecker");
const {
  startBackend,
  startFrontend,
  createWindow,
  backendProcess,
  frontendProcess,
} = require("./utility/appLauncher");

const gotTheLock = app.requestSingleInstanceLock();

process.env.NODE_ENV = app.isPackaged ? "production" : "development";

// ipc handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
ipcMain.handle("check-for-updates", async () => {
  await checkForUpdates();
});

if (!gotTheLock) {
  app.quit();
  return;
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Start the app
app.whenReady().then(async () => {
  log.info("App is ready. Checking for updates...");
  checkForUpdates();

  log.info("Starting backend...");
  startBackend();

  log.info("Waiting for backend to be available...");
  await new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 15;
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
  log.info("Closing application...");

  if (backendProcess) {
    log.info("Terminating backend process...");
    backendProcess.kill();
  }

  if (frontendProcess) {
    log.info("Terminating frontend process...");
    frontendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  log.info("Application is quitting...");

  if (backendProcess) {
    log.info("Killing backend process...");
    backendProcess.kill();
  }

  if (frontendProcess) {
    log.info("Killing frontend process...");
    frontendProcess.kill();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
