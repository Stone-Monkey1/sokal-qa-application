const path = require("path");
const express = require("express");
const cors = require("cors");
const os = require("os");

// Import Utility
const ensureChromiumInstalled = require("./Utility/chromiumInstaller");
const runSinglePageTests = require("./CoreTests/runSinglePageTests");
const runWebsiteTests = require("./CoreTests/runWebsiteTests");
const {
  normalizeUrlKey,
  normalizeTestResultKeys,
} = require("./Utility/normalize");
const { launchPage } = require("./Utility/browserContext");


const getNavbarLinks = require("./Utility/getNavbarLinks");
const getBodyImages = require("./Utility/getBodyImages");
const websiteKeywordSearch = require("./AdditionalTests/websiteKeywordSearch");

// Load all tests
const navbarTitleCheckTest = require("./CoreTests/Navbar/navbarTitleCheckTest");
const navbarH1CheckTest = require("./CoreTests/Navbar/navbarH1CheckTest");
const navbarImgAltTagTest = require("./CoreTests/Navbar/navbarImgAltTagTest");
const navbarImgResponsiveTest = require("./CoreTests/Navbar/navbarImgResponsiveTest");
const navbarSpellCheckTest = require("./CoreTests/Navbar/navbarSpellCheckTest");
const navbarCheckVideo = require("./CoreTests/Navbar/navbarCheckVideo");
const navbarDescriptionCheckTest = require("./CoreTests/Navbar/navbarDescriptionCheckTest");
const navbarFormTitle = require("./CoreTests/Navbar/navbarFormTitle");

const homepageQuickLinksTest = require("./CoreTests/Homepage/homepageQuickLinksTest");
const homepageTabbedSearchFilterTest = require("./CoreTests/Homepage/homepageTabbedSearchFilterTest");
const homepageVehicleCarouselTest = require("./CoreTests/Homepage/homepageVehicleCarouselTest");
const homepageInteractionBarTest = require("./CoreTests/Homepage/homepageInteractionBarTest");
const homepageNavbarImgAltTagTest = require("./CoreTests/Homepage/homepageNavbarImgAltTagTest");
const homepageNavbarImgResponsiveTest = require("./CoreTests/Homepage/homepageNavbarImgResponsiveTest");

const cssAudit = require("./AdditionalTests/cssAudit");

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
  navbarFormTitle,
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
  const { url, keywords, mode } = req.body;
  try {
    const results = await websiteKeywordSearch(url, keywords, mode);
    res.json(results);
  } catch (err) {
    console.error("❌ Keyword search failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/css-audit", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });
  try {
    console.log(`🔍 Running CSS audit on: ${url}`);

    const { browser, page } = await launchPage();

    try {
      await page.goto(url, { waitUntil: "load", timeout: 40000 });
    } catch (err) {
      console.warn(
        "Primary navigation failed. Retrying with domcontentloaded..."
      );
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    }

    console.log("✅ Page loaded successfully. Starting audit...");

    let auditResults;

    try {
      auditResults = await cssAudit(page);
    } catch (auditErr) {
      console.error(
        "❌ cssAudit(page) threw an error:",
        auditErr.stack || auditErr.message
      );
      await browser.close();
      return res.status(500).json({ error: "CSS audit execution failed." });
    }

    await browser.close();

    if (!auditResults) {
      console.log("✅ CSS audit found no issues.");
      return res.json({ [url]: { cssAudit: null } });
    }

    const normalized = normalizeTestResultKeys(auditResults, normalizeUrlKey);
    res.json(normalized);
  } catch (err) {
    console.error("❌ CSS Audit failed:", err.stack || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(3000, "0.0.0.0", () => console.log("Server running on port 3000"));
