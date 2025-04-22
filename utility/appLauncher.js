const { exec, spawn } = require("child_process");
const path = require("path");
const net = require("net");
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

  const killCommand = `lsof -i :3000 -t | xargs kill -9`;
  exec(killCommand, (err) => {
    if (err) {
      log.warn(`⚠️ Could not kill process on port 3000: ${err.message}`);
    } else {
      log.info(`🔪 Killed process using port 3000`);
    }
    function waitForPortToBeFree(port, callback, retries = 5) {
      const check = () => {
        const server = net
          .createServer()
          .once("error", (err) => {
            if (err.code === "EADDRINUSE") {
              if (retries > 0) {
                log.warn(`⚠️ Port ${port} still in use. Retrying...`);
                setTimeout(() => check(--retries), 500);
              } else {
                log.error(
                  `❌ Port ${port} still in use after multiple attempts.`
                );
                callback(false);
              }
            } else {
              callback(false, err);
            }
          })
          .once("listening", () => {
            server.close();
            log.info(`✅ Port ${port} is now free.`);
            callback(true);
          })
          .listen(port);
      };

      check();
    }

    // Wait for port to be free before launching backend
    waitForPortToBeFree(3000, (isFree) => {
      if (!isFree) return;

      _backendProcess = spawn(nodePath, [backendPath], {
        stdio: "pipe",
        detached: false,
      });

      _backendProcess.stdout.on("data", (data) => {
        log.info(`[Backend STDOUT]: ${data.toString()}`);
      });
      _backendProcess.stderr.on("data", (data) => {
        log.error(`[Backend STDERR]: ${data.toString()}`);
      });

      _backendProcess.on("exit", (code, signal) => {
        log.info(
          `💀 Backend process exited with code ${code}, signal ${signal}`
        );
        _backendProcess = null;
      });

      log.info(`🧠 Backend process started with PID: ${_backendProcess.pid}`);
    });
  });
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
    frame: true,
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
