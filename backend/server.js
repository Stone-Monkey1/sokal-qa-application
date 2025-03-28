const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const express = require("express");
const cors = require("cors");
const { chromium } = require("playwright");
const os = require("os");

const isProduction = require.main?.filename.includes(".app");

const nodePath =
  isProduction && process.resourcesPath
    ? path.join(process.resourcesPath, "node-bin", "node")
    : process.execPath;

console.log(`📦 Using node binary: ${nodePath}`);

const homeDir = process.env.HOME || process.env.USERPROFILE || os.homedir();

if (!homeDir) {
  throw new Error("❌ Unable to determine user's home directory.");
}

function ensureChromiumInstalled() {
  const chromiumCacheDir = path.join(
    homeDir,
    "Library",
    "Caches",
    "ms-playwright"
  );

  let found = false;

  if (fs.existsSync(chromiumCacheDir)) {
    const entries = fs.readdirSync(chromiumCacheDir);
    found = entries.some((folder) => {
      const fullPath = path.join(
        chromiumCacheDir,
        folder,
        "chrome-mac",
        "headless_shell"
      );
      const exists = fs.existsSync(fullPath);
      console.log(`✅ Found Chromium at: ${folder} (${exists ? "✓" : "✗"})`);
      return exists; // 💡 No longer restricted to folder name
    });
  }

  if (!found) {
    console.log("🧩 Chromium not found. Installing...");
    try {
      execFileSync(
        nodePath,
        ["node_modules/playwright/cli.js", "install", "chromium"],
        {
          cwd: path.resolve(__dirname),
          stdio: "inherit",
        }
      );
      console.log("✅ Chromium installed successfully.");
    } catch (err) {
      console.error("❌ Failed to install Chromium:", err.message);
    }
  } else {
    console.log("✅ Chromium already installed.");
  }
}

ensureChromiumInstalled();
// --- App Setup ---
const navbarTitleCheckTest = require("./Tests/Navbar/navbarTitleCheckTest");
const navbarH1CheckTest = require("./Tests/Navbar/navbarH1CheckTest");
const navbarImgAltTagTest = require("./Tests/Navbar/navbarImgAltTagTest");
const navbarImgResponsiveTest = require("./Tests/Navbar/navbarImgResponsiveTest");
const navbarSpellCheckTest = require("./Tests/Navbar/navbarSpellCheckTest");
const navbarCheckVideo = require("./Tests/Navbar/navbarCheckVideo");
const homepageQuickLinksTest = require("./Tests/Homepage/homepageQuickLinksTest");
const homepageTabbedSearchFilterTest = require("./Tests/Homepage/homepageTabbedSearchFilterTest");
const homepageVehicleCarouselTest = require("./Tests/Homepage/homepageVehicleCarouselTest");
const homepageInteractionBarTest = require("./Tests/Homepage/homepageInteractionBarTest");

const getNavbarLinks = require("./Utility/getNavbarLinks");
const getImages = require("./Utility/getImages");

const app = express();
app.use(express.json());
app.use(cors());

const executedTests = new Set();

const navbarTests = {
  navbarTitleCheckTest,
  navbarH1CheckTest,
  navbarSpellCheckTest,
  navbarCheckVideo,
};

const navbarImgTests = {
  navbarImgAltTagTest,
  navbarImgResponsiveTest,
};

const homepageTests = {
  homepageQuickLinksTest,
  homepageTabbedSearchFilterTest,
  homepageVehicleCarouselTest,
  homepageInteractionBarTest,
};

console.log("Backend server starting...");
console.log("PID is:", process.pid);

// Handle crashes
process.on("uncaughtException", (err) =>
  console.error("❌ Uncaught Exception:", err)
);
process.on("unhandledRejection", (reason) =>
  console.error("❌ Unhandled Rejection:", reason)
);

async function runTests(url, selectedTests) {
  console.log("Resetting test results...");
  const results = {};
  executedTests.clear();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  });
  await context.clearCookies();
  await context.clearPermissions();

  const page = await context.newPage();

  console.log(`Navigating to homepage: ${url}`);
  await page.goto(url, {
    timeout: 60000,
    waitUntil: "networkidle",
    referer: "",
    noCache: true,
    extraHTTPHeaders: {
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    },
  });

  const navbarLinks = await getNavbarLinks(page);
  if (!Array.isArray(navbarLinks)) {
    console.error("Error: navbarLinks is not an array");
    await browser.close();
    return { error: "Failed to retrieve navbar links" };
  }

  const allPages = [url, ...navbarLinks];
  const navbarTestsSelected = Object.keys(navbarTests).some((t) =>
    selectedTests.includes(t)
  );
  const imageTestsSelected = Object.keys(navbarImgTests).some((t) =>
    selectedTests.includes(t)
  );

  results[url] = {};
  for (const testName of selectedTests) {
    if (homepageTests[testName]) {
      console.log(`Running homepage test: ${testName} on ${url}`);
      try {
        const result = await homepageTests[testName](page);
        if (result) {
          results[url] = { ...results[url], ...result[url] };
        }
      } catch (error) {
        console.error(`Error running ${testName} on homepage:`, error.message);
      }
    }
  }

  if (navbarTestsSelected || imageTestsSelected) {
    for (const link of allPages) {
      try {
        console.log(`Navigating to: ${link}`);
        await page.goto(link, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
      } catch {
        console.error(`⚠️ Skipping ${link} due to timeout.`);
        results[link] = { error: "Page load timeout" };
        continue;
      }

      results[link] = results[link] || {};

      let images = null;
      if (imageTestsSelected) {
        images = await getImages(page);
      }

      for (const testName of selectedTests) {
        if (homepageTests[testName]) continue;
        const testKey = `${testName}-${link}`;
        if (executedTests.has(testKey)) continue;

        executedTests.add(testKey);
        console.log(`Running ${testName} on ${link}`);
        try {
          let result;
          if (navbarTests[testName]) {
            result = await navbarTests[testName](page);
          } else if (navbarImgTests[testName]) {
            result = await navbarImgTests[testName](page, images);
          }

          if (result && result[link]) {
            results[link] = { ...results[link], ...result[link] };
          }
        } catch (err) {
          console.error(`Error running ${testName} on ${link}:`, err.message);
        }
      }
    }
  }

  await browser.close();
  return results;
}

app.post("/run-tests", async (req, res) => {
  console.log("Received request:", req.body);
  const { url, selectedTests } = req.body;

  if (!url) {
    console.error("Error: URL is missing");
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const results = await runTests(url, selectedTests);
    console.log("Test results:", results);
    res.json(results);
    executedTests.clear();
    console.log("Executed tests cleared.");
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, "0.0.0.0", () => console.log("Server running on port 3000"));
