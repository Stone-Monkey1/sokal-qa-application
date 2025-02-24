const getNavbarLinks = require("../Utility/getNavbarLinks");
const runAdditionalChecks = require("../Utility/runAdditionalChecks");

async function navbarH1CheckTest(page, selectedTests) {
  const missingH1Pages = {}; // Store only pages missing <h1>
  const links = await getNavbarLinks(page); // Fetch links once

  console.log("Found links:", links);

  for (const link of links) {
    try {
      console.log(`Navigating to: ${link}`);
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Check if an <h1> exists
      const h1Count = await page.locator("h1").count();
      console.log(`H1 count for ${link}: ${h1Count}`);

      // If <h1> is missing, record this page
      if (h1Count === 0) {
        console.log(`No <h1> found on ${link}, recording issue.`);
        missingH1Pages[link] = { error: "Missing <h1>" };
      } else {
        console.log(`<h1> found on ${link}, skipping.`);
      }

      // Run additional tests dynamically (excluding this one)
      const additionalTests = selectedTests.filter(
        (test) => test !== "navbarH1CheckTest"
      );
      const additionalResults = await runAdditionalChecks(
        page,
        additionalTests
      );

      // Merge results if this page is recorded
      if (missingH1Pages[link]) {
        missingH1Pages[link] = {
          ...missingH1Pages[link],
          ...additionalResults,
        };
      }
    } catch (error) {
      console.error(`Error loading ${link}:`, error.message);
      missingH1Pages[link] = { error: "Error loading page" };
    }
  }

  return missingH1Pages;
}

module.exports = navbarH1CheckTest;
