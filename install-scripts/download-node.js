// scripts/download-node.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const NODE_VERSION = "18.18.0";
const NODE_PLATFORM = process.platform;
const NODE_ARCH = process.arch;

let downloadUrl = "";
let tarSubfolder = "";

if (NODE_PLATFORM === "darwin" && NODE_ARCH === "arm64") {
  downloadUrl = `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-arm64.tar.gz`;
  tarSubfolder = `node-v${NODE_VERSION}-darwin-arm64`;
} else if (NODE_PLATFORM === "darwin" && NODE_ARCH === "x64") {
  downloadUrl = `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-x64.tar.gz`;
  tarSubfolder = `node-v${NODE_VERSION}-darwin-x64`;
} else {
  console.error("❌ Unsupported platform or architecture.");
  process.exit(1);
}

const outDir = path.resolve(__dirname, "../node-bin");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
  console.log("📁 Created node-bin directory");
}

const tempDir = path.resolve(__dirname, "../.tmp-node-download");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

console.log(`⬇️ Downloading Node.js from ${downloadUrl}`);

try {
  const downloadCommand = `curl -L ${downloadUrl} | tar -xz -C "${tempDir}"`;
  execSync(downloadCommand, { stdio: "inherit" });

  const nodePath = path.join(tempDir, tarSubfolder, "bin", "node");
  const targetPath = path.join(outDir, "node");

  fs.copyFileSync(nodePath, targetPath);
  fs.chmodSync(targetPath, 0o755);

  console.log(`✅ Copied 'node' binary to node-bin/node`);

  // Clean up temp
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log("🧹 Cleaned up temporary files");
} catch (err) {
  console.error("❌ Error during download/extract:", err.message);
  process.exit(1);
}
