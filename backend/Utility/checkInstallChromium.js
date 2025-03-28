const fs = require("fs");
const path = require("path");

const {
  installBrowsersForNpmInstall,
} = require("@playwright/test/lib/install/installer");

const chromiumPath = path.join(
  __dirname,
  "..",
  ".local-browsers",
  "chromium-1161"
);

function chromiumExists() {
  return fs.existsSync(chromiumPath);
}

module.exports = async function ensureChromiumInstalled() {
  if (!chromiumExists()) {
    console.log("🧩 Chromium not found. Installing...");
    try {
      await installBrowsersForNpmInstall(["chromium"]);
      console.log("✅ Chromium installed successfully.");
    } catch (error) {
      console.error("❌ Failed to install Chromium:", error.message);
    }
  } else {
    console.log("✅ Chromium already installed.");
  }
};
