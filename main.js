const { app, ipcMain } = require("electron");
const log = require("electron-log");
const { checkForUpdates } = require("./utility/updateChecker");
const launcher = require("./utility/appLauncher");

const gotTheLock = app.requestSingleInstanceLock();
process.env.NODE_ENV = app.isPackaged ? "production" : "development";

// IPC handlers
ipcMain.handle("get-app-version", () => app.getVersion());
ipcMain.handle("check-for-updates", async () => await checkForUpdates());

if (!gotTheLock) {
  app.quit();
  return;
}

app.on("second-instance", () => {
  const win = launcher.getMainWindow();
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  if (launcher.getMainWindow() === null) {
    launcher.createWindow();
  }
});

app.whenReady().then(async () => {
  log.info("App is ready. Checking for updates...");
  checkForUpdates();

  log.info("Starting backend...");
  launcher.startBackend();

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
  launcher.startFrontend();

  log.info("Creating Electron window...");
  launcher.createWindow();
});

function killProcesses() {
  const backend = launcher.getBackendProcess();
  if (backend) {
    log.info("Killing backend process...");

    try {
      process.kill(backend.pid, 0); // check if alive
      process.kill(backend.pid, "SIGTERM");
      log.info("✅ Backend process killed.");
    } catch (err) {
      if (err.code === "ESRCH") {
        log.warn("⚠️ Backend process already exited.");
      } else {
        log.error("❌ Error killing backend process:", err.message);
      }
    }
  } else {
    log.warn("⚠️ No backend process found.");
  }

  const frontend = launcher.getFrontendProcess();
  if (frontend) {
    log.info("Killing frontend process...");
    frontend.kill();
  }
}

app.on("window-all-closed", () => {
  log.info("Closing application...");
  killProcesses();
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  log.info("Application is quitting...");
  killProcesses();
});
