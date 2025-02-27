const express = require("express");
const cors = require("cors");
const { chromium } = require("playwright");

//  IMPORT TESTS!!
const navbarTitleCheckTest = require("./Tests/navbarTitleCheckTest");
const navbarH1CheckTest = require("./Tests/navbarH1CheckTest");
const navbarAltTagRepeatTest = require("./Tests/navbarAltTagRepeatTest");
const navbarSpellCheckTest = require("./Tests/navbarSpellCheckTest");

// IMPORT UTILITY
const getNavbarLinks = require("./Utility/getNavbarLinks");

const app = express();
app.use(express.json());
app.use(cors());

const executedTests = new Set(); // Global test execution tracker

// ADD NEW TESTS HERE

const testModules = {
  navbarTitleCheckTest,
  navbarH1CheckTest,
  navbarAltTagRepeatTest,
  navbarSpellCheckTest,
};

async function runTests(url, tests) {
  const results = {};
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url, { timeout: 60000 });

  const navbarLinks = await getNavbarLinks(page);
  if (!Array.isArray(navbarLinks)) {
    console.error("Error: navbarLinks is not an array");
    await browser.close();
    return { error: "Failed to retrieve navbar links" };
  }

  for (const link of navbarLinks) {
    console.log(`Navigating to: ${link}`);
    await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

    if (!results[link]) {
      results[link] = {};
    }

    for (const testName of tests) {
      const testKey = `${testName}-${link}`;
      if (executedTests.has(testKey)) {
        console.log(`Skipping ${testName} on ${link} (already executed).`);
        continue;
      }

      executedTests.add(testKey);
      console.log(`Running ${testName} on ${link}`);

      try {
        const testModule = testModules[testName]; // Get test dynamically
        if (!testModule) {
          console.warn(`Test ${testName} not found.`);
          continue;
        }

        const result = await testModule(
          page,
          tests,
          navbarLinks,
          executedTests
        );
        if (result && result[link]) {
          results[link] = { ...results[link], ...result[link] };
        }
      } catch (error) {
        console.error(`Error running ${testName} on ${link}:`, error.message);
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

app.listen(3000, () => console.log("Server running on port 3000"));
