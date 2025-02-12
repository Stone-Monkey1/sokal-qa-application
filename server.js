const express = require("express");
const { chromium } = require("playwright");

async function runTests(url, tests) {
  const results = {};
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Apply stealth-like JavaScript to evade detection
  await page.addInitScript(() => {
    // Remove Playwright's WebDriver property
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });

    // Spoof navigator properties
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });

    Object.defineProperty(navigator, "platform", {
      get: () => "Win32",
    });

    Object.defineProperty(navigator, "userAgent", {
      get: () =>
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.77 Safari/537.36",
    });
  });

  await page.goto(url, { timeout: 60000 });

  if (tests.includes("loadTime")) {
    const timing = await page.evaluate(() => performance.timing);
    results.loadTime = timing.loadEventEnd - timing.navigationStart;
  }

  if (tests.includes("titleCheck")) {
    results.title = await page.title();
  }

  await browser.close();
  return results;
}

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Function to run Playwright tests
async function runTests(url, tests) {
  const results = {};
  const browser = await chromium.launch({ headless: true });

  // Create a new context with the User-Agent
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.77 Safari/537.36",
  });

  const page = await context.newPage();

  // Apply stealth-like JavaScript to evade detection
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
    Object.defineProperty(navigator, "platform", { get: () => "Win32" });
  });

  await page.goto(url, { timeout: 60000 });

  if (tests.includes("loadTime")) {
    const timing = await page.evaluate(() => performance.timing);
    results.loadTime = timing.loadEventEnd - timing.navigationStart;
  }

  if (tests.includes("titleCheck")) {
    results.title = await page.title();
  }

  await browser.close();
  return results;
}

app.post("/run-tests", async (req, res) => {
  console.log("Received request:", req.body); // Debugging log
  const { url, selectedTests } = req.body;

  if (!url) {
    console.error("Error: URL is missing"); // Debug message
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const results = await runTests(url, selectedTests);
    console.log("Test results:", results); // Debugging log
    res.json(results);
  } catch (error) {
    console.error("Server Error:", error); // Debugging log
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
