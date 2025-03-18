const express = require("express");
const cors = require("cors");
const { chromium } = require("playwright");

//  IMPORT TESTS!!
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

// IMPORT UTILITY
const getNavbarLinks = require("./Utility/getNavbarLinks");
const getImages = require("./Utility/getImages");

const app = express();
app.use(express.json());
app.use(cors());

const executedTests = new Set(); // Global test execution tracker

// Categorize tests
const navbarTests = {
  navbarTitleCheckTest,
  navbarH1CheckTest,
  navbarSpellCheckTest,
  navbarCheckVideo,
};

// Image-related tests
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

  // Get navbar links
  const navbarLinks = await getNavbarLinks(page);
  if (!Array.isArray(navbarLinks)) {
    console.error("Error: navbarLinks is not an array");
    await browser.close();
    return { error: "Failed to retrieve navbar links" };
  }

  const allPages = [url, ...navbarLinks]; // Include homepage in navbar test pages

  // Check if any navbar-related tests are selected
  const navbarTestsSelected = Object.keys(navbarTests).some((test) =>
    selectedTests.includes(test)
  );
  const imageTestsSelected = Object.keys(navbarImgTests).some((test) =>
    selectedTests.includes(test)
  );

  // Run Homepage Tests (ONLY on the homepage)
  results[url] = {};
  for (const testName of selectedTests) {
    if (homepageTests[testName]) {
      console.log(`Running homepage test: ${testName} on ${url}`);

      try {
        const testModule = homepageTests[testName];
        const result = await testModule(page);

        if (result) {
          results[url] = { ...results[url], ...result[url] };
        }
      } catch (error) {
        console.error(`Error running ${testName} on homepage:`, error.message);
      }
    }
  }

  // Only loop through other pages if navbar-related tests are selected**
  if (navbarTestsSelected || imageTestsSelected) {
    for (const link of allPages) {
      try {
        console.log(`Navigating to: ${link}`);
        await page.goto(link, {
          waitUntil: "domcontentloaded",
          timeout: 60000, // Increased timeout
        });
      } catch (error) {
        console.error(`⚠️ Skipping ${link} due to timeout.`);
        results[link] = { error: "Page load timeout" };
        continue; // Skip this page and move to the next one
      }
      if (!results[link]) {
        results[link] = {};
      }

      let images = null;
      if (imageTestsSelected) {
        images = await getImages(page);
      }

      for (const testName of selectedTests) {
        if (homepageTests[testName]) continue; // 🔥 Skip homepage tests on non-homepage pages

        const testKey = `${testName}-${link}`;
        if (executedTests.has(testKey)) {
          console.log(`Skipping ${testName} on ${link} (already executed).`);
          continue;
        }

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
        } catch (error) {
          console.error(`Error running ${testName} on ${link}:`, error.message);
        }
      }
    }
  } else {
    console.log(
      `Skipping navbar page navigation since only homepage tests were selected.`
    );
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
