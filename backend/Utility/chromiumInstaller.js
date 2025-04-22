module.exports = function ensureChromiumInstalled(nodePath) {
  const { execFileSync } = require("child_process");
  const path = require("path");
  try {
    console.log("\ud83d\udce6 Ensuring Chromium is installed...");
    execFileSync(
      nodePath,
      ["node_modules/playwright/cli.js", "install", "chromium"],
      {
        cwd: path.resolve(__dirname, "../"),
        stdio: "inherit",
      }
    );
    console.log("\u2705 Chromium install command completed.");
  } catch (err) {
    console.error("\u274c Failed to install Chromium:", err.message);
  }
};
