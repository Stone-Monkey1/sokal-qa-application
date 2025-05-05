const https = require("https");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const NODE_VERSION = "18.18.0"; // or whatever version you're using
const NODE_PLATFORM = process.platform; // 'darwin', 'linux', 'win32'
const NODE_ARCH = process.arch; // 'x64', 'arm64', etc.

let downloadUrl = "";

if (NODE_PLATFORM === "darwin" && NODE_ARCH === "arm64") {
  downloadUrl = `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-arm64.tar.gz`;
} else if (NODE_PLATFORM === "darwin" && NODE_ARCH === "x64") {
  downloadUrl = `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-x64.tar.gz`;
} else {
  console.error("Unsupported platform or architecture.");
  process.exit(1);
}

const outDir = path.resolve(__dirname, "node-bin");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

console.log(`⬇Downloading Node.js from ${downloadUrl}`);

const downloadCommand = `curl -L ${downloadUrl} | tar -xz --strip-components=1 -C ${outDir}`;
execSync(downloadCommand, { stdio: "inherit" });

console.log("Node.js downloaded to node-bin/");
