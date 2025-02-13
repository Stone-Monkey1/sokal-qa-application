const express = require("express");
const cors = require("cors");
const { chromium } = require("playwright");

//  IMPORT TESTS!!
const loadTimeTest = require("./Tests/loadTimeTest");
const titleCheckTest = require("./Tests/titleCheckTest");
const navbarTitleCheckTest = require("./Tests/navbarTitleCheckTest");

const app = express();
app.use(express.json());
app.use(cors());

async function runTests(url, tests) {
  const results = {};
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.110 Safari/537.36",
  });
  const page = await context.newPage();

  // Apply stealth-like JavaScript to evade detection. I tried to asked Carson if this is sus or not, no response yet.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
    Object.defineProperty(navigator, "platform", { get: () => "Win32" });
  });

  await page.goto(url, { timeout: 60000 });

  // ADD TESTS YOU'VE IMPORTED HERE

  if (tests.includes("loadTime")) {
    results.loadTime = await loadTimeTest(page);
  }
  if (tests.includes("titleCheck")) {
    results.title = await titleCheckTest(page);
  }
  if (tests.includes("navbarTitleCheckTest")) {
    results.navbarPageTitles = await navbarTitleCheckTest(page);
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
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
