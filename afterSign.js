const fs = require("fs");
const path = require("path");

module.exports = async (context) => {
  const appPath = context.appOutDir;
  const appName = context.packager.appInfo.productFilename;
  const quarantinePath = path.join(appPath, `${appName}.app`);

  const sourcePath = path.join(
    appPath,
    "Contents",
    "Resources",
    "app",
    "build",
    "app-update.yml"
  );
  const destinationPath = path.join(
    appPath,
    "Contents",
    "Resources",
    "app-update.yml"
  );

  if (fs.existsSync(sourcePath)) {
    console.log(`🚀 Moving app-update.yml to correct location...`);
    fs.renameSync(sourcePath, destinationPath);
    console.log(`✅ app-update.yml moved to: ${destinationPath}`);
  } else {
    console.warn(`⚠️ app-update.yml not found at: ${sourcePath}`);
  }

  console.log(`Removing quarantine attribute from ${quarantinePath}...`);
  try {
    require("child_process").execSync(
      `xattr -rd com.apple.quarantine "${quarantinePath}"`
    );
    console.log("Quarantine attribute removed successfully.");
  } catch (error) {
    console.error("Failed to remove quarantine attribute:", error);
  }
};
