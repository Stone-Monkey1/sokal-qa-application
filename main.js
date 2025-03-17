const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const path = require("path");

let mainWindow;
let backendProcess;
let frontendProcess;


function startBackend() {
  console.log("🚀 Starting backend server...");

  const backendPath = path.join(__dirname, "backend", "server.js"); // ✅ Corrected path

  backendProcess = exec(`node ${backendPath}`);

  backendProcess.stdout.on("data", (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on("data", (data) =>
    console.error(`Backend Error: ${data}`)
  );
  backendProcess.on("exit", (code) =>
    console.log(`❌ Backend process exited with code: ${code}`)
  );
}

function startFrontend() {
  console.log("Starting frontend server...");

  frontendProcess = exec(
    "cd frontend && npm run serve",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Frontend error: ${error.message}`); // FIXED
        return;
      }
      if (stderr) {
        console.error(`Frontend stderr: ${stderr}`); // FIXED
        return;
      }
      console.log(`Frontend stdout: ${stdout}`); // FIXED
    }
  );

  frontendProcess.stdout.on("data", (data) => console.log(`Frontend: ${data}`)); // FIXED
  frontendProcess.stderr.on(
    "data",
    (data) => console.error(`Frontend Error: ${data}`) // FIXED
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Wait a few seconds for the frontend to start before loading it
  setTimeout(() => {
    console.log("🚀 Loading frontend into Electron...");
    mainWindow.loadURL("http://localhost:8080");
  }, 5000);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  startBackend();

  // Wait for backend to be available
  await new Promise((resolve) => {
    const checkInterval = setInterval(async () => {
      const net = require("net");
      const client = new net.Socket();
      client
        .connect(3000, "127.0.0.1", () => {
          console.log("✅ Backend is now running!");
          clearInterval(checkInterval);
          client.destroy();
          resolve();
        })
        .on("error", () => {
          console.log("⌛ Waiting for backend...");
        });
    }, 1000);
  });

  startFrontend();
  createWindow();
});

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
