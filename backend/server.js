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
  try {
    console.log("📦 Ensuring Chromium is installed...");
    execFileSync(
      nodePath,
      ["node_modules/playwright/cli.js", "install", "chromium"],
      {
        cwd: path.resolve(__dirname),
        stdio: "inherit",
      }
    );
    console.log("✅ Chromium install command completed.");
  } catch (err) {
    console.error("❌ Failed to install Chromium:", err.message);
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
const navbarDescriptionCheckTest = require("./Tests/Navbar/navbarDescriptionCheckTest");
const homepageQuickLinksTest = require("./Tests/Homepage/homepageQuickLinksTest");
const homepageTabbedSearchFilterTest = require("./Tests/Homepage/homepageTabbedSearchFilterTest");
const homepageVehicleCarouselTest = require("./Tests/Homepage/homepageVehicleCarouselTest");
const homepageInteractionBarTest = require("./Tests/Homepage/homepageInteractionBarTest");
const homepageNavbarImgAltTagTest = require("./Tests/Homepage/homepageNavbarImgAltTagTest");
const homepageNavbarImgResponsiveTest = require("./Tests/Homepage/homepageNavbarImgResponsiveTest");

const getNavbarLinks = require("./Utility/getNavbarLinks");
const getBodyImages = require("./Utility/getBodyImages");

const app = express();
app.use(express.json());
app.use(cors());

const executedTests = new Set();

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

const homepageTests = {
  homepageQuickLinksTest,
  homepageTabbedSearchFilterTest,
  homepageVehicleCarouselTest,
  homepageInteractionBarTest,
  homepageNavbarImgAltTagTest,
  homepageNavbarImgResponsiveTest,
};

console.log("Backend server starting...");
console.log("PID is:", process.pid);

process.on("uncaughtException", (err) =>
  console.error("❌ Uncaught Exception:", err)
);
process.on("unhandledRejection", (reason) =>
  console.error("❌ Unhandled Rejection:", reason)
);

function normalizeUrlKey(rawUrl) {
  try {
    const url = new URL(rawUrl);
    url.hostname = url.hostname.replace(/^www\./, "");
    url.hash = "";
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function normalizeTestResultKeys(resultObj) {
  const normalized = {};
  for (const rawKey of Object.keys(resultObj)) {
    const normalizedKey = normalizeUrlKey(rawKey);
    normalized[normalizedKey] = resultObj[rawKey];
  }
  return normalized;
}

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
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });

  const navbarLinks = await getNavbarLinks(page);
  if (!Array.isArray(navbarLinks)) {
    console.error("Error: navbarLinks is not an array");
    await browser.close();
    return { error: "Failed to retrieve navbar links" };
  }

  const normalizedHomepageUrl = normalizeUrlKey(url);
  const allPages = [
    url,
    ...navbarLinks.filter(
      (link) => normalizeUrlKey(link) !== normalizedHomepageUrl
    ),
  ];

  const navbarTestsSelected = Object.keys(navbarTests).some((t) =>
    selectedTests.includes(t)
  );
  const imageTestsSelected = Object.keys(navbarImgTests).some((t) =>
    selectedTests.includes(t)
  );
  results[normalizedHomepageUrl] = {};

  for (const testName of selectedTests) {
    if (homepageTests[testName]) {
      console.log(`Running homepage test: ${testName} on ${url}`);
      try {
        const result = await homepageTests[testName](page);
        const normalizedResult = normalizeTestResultKeys(result || {});
        results[normalizedHomepageUrl] = {
          ...results[normalizedHomepageUrl],
          ...normalizedResult[normalizedHomepageUrl],
        };
      } catch (error) {
        console.error(`Error running ${testName} on homepage:`, error.message);
      }
    }
  }

  if (navbarTestsSelected || imageTestsSelected) {
    for (const link of allPages) {
      const normalizedLink = normalizeUrlKey(link);
      try {
        console.log(`Navigating to: ${link}`);
        await page.goto(link, {
          waitUntil: "domcontentloaded",
          timeout: 40000,
        });
      } catch {
        console.error(`⚠️ Skipping ${link} due to timeout.`);
        if (
          !results[normalizedLink] ||
          Object.keys(results[normalizedLink]).length === 0
        ) {
          results[normalizedLink] = { error: "Page load timeout" };
        }
        continue;
      }

      results[normalizedLink] = results[normalizedLink] || {};

      let images = null;
      if (imageTestsSelected) {
        images = await getBodyImages(page);
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
          const normalizedResult = normalizeTestResultKeys(result || {});
          results[normalizedLink] = {
            ...results[normalizedLink],
            ...normalizedResult[normalizedLink],
          };
        } catch (err) {
          console.error(`Error running ${testName} on ${link}:`, err.message);
        }
      }
    }
  }

  await browser.close();
  return results;
}

async function runSinglePageTests(url, selectedTests) {
  console.log("📄 Running SINGLE PAGE tests...");
  const results = {};
  const normalizedHomepageUrl = normalizeUrlKey(url);
  executedTests.clear();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  });
  await context.clearCookies();
  await context.clearPermissions();
  const page = await context.newPage();

  console.log(`Navigating to: ${url}`);

  await page.goto(url, {
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });

  results[normalizedHomepageUrl] = {};
  const imageTestsSelected = Object.keys(navbarImgTests).some((t) =>
    selectedTests.includes(t)
  );
  let images = null;
  if (imageTestsSelected) images = await getBodyImages(page);

  for (const testName of selectedTests) {
    const testKey = `${testName}-${url}`;
    if (executedTests.has(testKey)) continue;
    executedTests.add(testKey);
    try {
      let result;
      if (homepageTests[testName]) {
        result = await homepageTests[testName](page);
      } else if (navbarTests[testName]) {
        result = await navbarTests[testName](page);
      } else if (navbarImgTests[testName]) {
        result = await navbarImgTests[testName](page, images);
      }
      const normalizedResult = normalizeTestResultKeys(result || {});
      results[normalizedHomepageUrl] = {
        ...results[normalizedHomepageUrl],
        ...normalizedResult[normalizedHomepageUrl],
      };
    } catch (err) {
      console.error(`Error running ${testName} on ${url}:`, err.message);
    }
  }

  await browser.close();
  return results;
}

app.post("/run-tests", async (req, res) => {
  console.log("Received request:", req.body);
  const { url, selectedTests, mode } = req.body;
  console.log("Recieved mode:", mode);

  if (!url) {
    console.error("Error: URL is missing");
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const results =
      mode === "single"
        ? await runSinglePageTests(url, selectedTests)
        : await runTests(url, selectedTests);

    const normalizedResults = normalizeTestResultKeys(results);

    console.log("Test results:", normalizedResults);
    res.json(normalizedResults);
    executedTests.clear();
    console.log("Executed tests cleared.");
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, "0.0.0.0", () => console.log("Server running on port 3000"));
