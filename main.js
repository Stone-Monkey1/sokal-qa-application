const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const log = require("electron-log");
const { exec } = require("child_process");
const path = require("path");
const axios = require("axios");
const semver = require("semver");

const gotTheLock = app.requestSingleInstanceLock();

process.env.NODE_ENV = app.isPackaged ? "production" : "development";

let mainWindow;
let backendProcess;
let frontendProcess;

// ipc handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
ipcMain.handle("check-for-updates", async () => {
  await checkForUpdates();
});

// Check for updates
async function checkForUpdates() {
  log.info("🔄 Checking for updates...");

  const repoOwner = "Stone-Monkey1";
  const repoName = "sokal-qa-application";

  try {
    // Fetch the latest release from GitHub API
    const response = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`
    );
    const latestVersion = response.data.tag_name.replace("v", "").trim(); // Extract and clean version
    const currentVersion = app.getVersion().trim();

    log.info(`Latest version on GitHub: ${latestVersion}`);
    log.info(`Current app version: ${currentVersion}`);

    // Use semver to check if the GitHub version is newer
    if (semver.valid(latestVersion) && semver.valid(currentVersion)) {
      if (semver.gt(latestVersion, currentVersion)) {
        log.info("🚀 Update available! Prompting user...");
        const updateURL = response.data.html_url; // Link to the release page

        dialog
          .showMessageBox({
            type: "info",
            title: "Update Available",
            message: `A new version (v${latestVersion}) is available!`,
            buttons: ["Download", "Later"],
          })
          .then((result) => {
            if (result.response === 0) {
              shell.openExternal(updateURL); // Opens the GitHub releases page in the browser
            }
          });
      } else {
        log.info("✅ No update needed. Running latest or newer version.");
      }
    } else {
      log.warn("⚠️ Invalid version format detected.");
    }
  } catch (error) {
    log.error("❌ Failed to check for updates:", error.message);
  }
}

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

// Start backend
function startBackend() {
  log.info("🚀 Starting backend server...");

  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, "backend", "server.js")
    : path.join(__dirname, "backend", "server.js");

  const nodePath = app.isPackaged
    ? path.join(process.resourcesPath, "node-bin", "node") // Use packaged Node binary
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
    const indexPath = `file://${path.join(__dirname, "docs", "index.html")}`;
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
