const axios = require("axios");
const semver = require("semver");
const { app, shell, dialog } = require("electron");
const { exec } = require("child_process");
const log = require("electron-log");
const path = require("path");

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
    const latestVersion = response.data.tag_name.replace("v", "").trim();
    const currentVersion = app.getVersion().trim();

    log.info(`Latest version on GitHub: ${latestVersion}`);
    log.info(`Current app version: ${currentVersion}`);

    if (semver.valid(latestVersion) && semver.valid(currentVersion)) {
      if (semver.gt(latestVersion, currentVersion)) {
        log.info("🚀 Update available! Prompting user...");
        const updateURL = response.data.html_url;
        const zipFileName = `qaApp-${latestVersion}-arm64.zip`;

        dialog
          .showMessageBox({
            type: "info",
            title: "Update Available",
            message: `A new version (v${latestVersion}) is available! Click "Download" to get the update.`,
            buttons: ["Download", "Later"],
          })
          .then((result) => {
            if (result.response === 0) {
              shell.openExternal(updateURL);

              // Wait for user confirmation AFTER they manually download
              setTimeout(() => {
                dialog
                  .showMessageBox({
                    type: "info",
                    title: "Proceed with Update?",
                    message:
                      "After downloading the new version, press OK to continue updating.",
                    buttons: ["OK", "Cancel"],
                  })
                  .then((confirmResult) => {
                    if (confirmResult.response === 0) {
                      log.info(
                        "🔧 User confirmed. Opening terminal for update..."
                      );

                      const terminalScript = `
osascript -e 'tell application "Terminal"
  do script "cd ~/Downloads && \\
  echo \\"Press Enter to begin update...\\" && read dummy && \\
  unzip -o ${zipFileName} && \\
  echo \\"Press Enter to remove quarantine...\\" && read dummy && \\
  xattr -rd com.apple.quarantine ~/Downloads/qaApp.app && \\
  echo \\"Press Enter to close the running app...\\" && read dummy && \\
  osascript -e \\"tell application \\\\\\"qaApp\\\\\\" to quit\\" && \\
  echo \\"Stopping backend process...\\" && sleep 2 && \\
  pkill -f backend/server.js || echo \\"⚠️ No backend process found or already closed.\\" && \\
  echo \\"Backend process stopped.\\" && \\
  echo \\"Press Enter to replace old app in Applications...\\" && read dummy && \\
  rm -rf /Applications/qaApp.app && \\
  mv -f ~/Downloads/qaApp.app /Applications/ && \\
  echo \\"Update complete! Press Enter to close...\\" && read dummy && \\
  exit"
end tell'
`;

                      exec(terminalScript, (error, stdout, stderr) => {
                        if (error) {
                          log.error(
                            "❌ Failed to execute update process:",
                            error.message
                          );
                          return;
                        }
                        log.info("✅ Terminal update process started.");
                      });
                    }
                  });
              }, 2000); // Give user time to return
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

module.exports = { checkForUpdates };
