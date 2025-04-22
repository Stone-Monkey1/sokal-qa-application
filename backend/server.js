const path = require("path");
const express = require("express");
const cors = require("cors");
const os = require("os");

// Import modules
const ensureChromiumInstalled = require("./Utility/chromiumInstaller");
const runSinglePageTests = require("./Tests/runSinglePageTests");
const runWebsiteTests = require("./Tests/runWebsiteTests");
const {
  normalizeUrlKey,
  normalizeTestResultKeys,
} = require("./Utility/normalize");

const getNavbarLinks = require("./Utility/getNavbarLinks");
const getBodyImages = require("./Utility/getBodyImages");
const websiteKeywordSearch = require("./Utility/websiteKeywordSearch");

// Load all tests
const navbarTitleCheckTest = require("./Tests/Navbar/navbarTitleCheckTest");
const navbarH1CheckTest = require("./Tests/Navbar/navbarH1CheckTest");
const navbarImgAltTagTest = require("./Tests/Navbar/navbarImgAltTagTest");
const navbarImgResponsiveTest = require("./Tests/Navbar/navbarImgResponsiveTest");
const navbarSpellCheckTest = require("./Tests/Navbar/navbarSpellCheckTest");
const navbarCheckVideo = require("./Tests/Navbar/navbarCheckVideo");
const navbarDescriptionCheckTest = require("./Tests/Navbar/navbarDescriptionCheckTest");

const homepageQuickLinksTest = require("./Tests/Homepage/homepageQuickLinksTest");
const homepageTabbedSearchFilterTest = require("./Tests/Homepage/homepageTabbedSearchFilterTest");
const homepageVehicleCarouselTest = require("./Tests/Homepage/homepageVehicleCarouselTest");
const homepageInteractionBarTest = require("./Tests/Homepage/homepageInteractionBarTest");
const homepageNavbarImgAltTagTest = require("./Tests/Homepage/homepageNavbarImgAltTagTest");
const homepageNavbarImgResponsiveTest = require("./Tests/Homepage/homepageNavbarImgResponsiveTest");

// Chromium Setup
const isProduction = require.main?.filename.includes(".app");
const nodePath =
  isProduction && process.resourcesPath
    ? path.join(process.resourcesPath, "node-bin", "node")
    : process.execPath;

const homeDir = process.env.HOME || process.env.USERPROFILE || os.homedir();
if (!homeDir) throw new Error("❌ Unable to determine user's home directory.");
ensureChromiumInstalled(nodePath);

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Test mapping
const homepageTests = {
  homepageQuickLinksTest,
  homepageTabbedSearchFilterTest,
  homepageVehicleCarouselTest,
  homepageInteractionBarTest,
  homepageNavbarImgAltTagTest,
  homepageNavbarImgResponsiveTest,
};

const navbarTests = {
  navbarTitleCheckTest,
  navbarH1CheckTest,
  navbarSpellCheckTest,
  navbarCheckVideo,
  navbarDescriptionCheckTest,
};

const navbarImgTests = {
  navbarImgAltTagTest,
  navbarImgResponsiveTest,
};

const testMaps = {
  homepageTests,
  navbarTests,
  navbarImgTests,
  getNavbarLinks,
};

// Server Events
console.log("Backend server starting...");
console.log("PID is:", process.pid);
process.on("uncaughtException", (err) =>
  console.error("❌ Uncaught Exception:", err)
);
process.on("unhandledRejection", (reason) =>
  console.error("❌ Unhandled Rejection:", reason)
);

// Route
app.post("/run-tests", async (req, res) => {
  const { url, selectedTests, mode } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const results =
      mode === "single"
        ? await runSinglePageTests(url, selectedTests, testMaps, getBodyImages)
        : await runWebsiteTests(url, selectedTests, testMaps, getBodyImages);

    const normalized = normalizeTestResultKeys(results, normalizeUrlKey);
    res.json(normalized);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/website-keyword-search", async (req, res) => {
  const { url, keywords } = req.body;
  try {
    const results = await websiteKeywordSearch(url, keywords);
    res.json({ success: true, results });
  } catch (err) {
    console.error("❌ Keyword search failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(3000, "0.0.0.0", () => console.log("Server running on port 3000"));
