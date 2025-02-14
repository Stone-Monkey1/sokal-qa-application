const getNavbarLinks = require("../Utility/getNavbarLinks");
const runAdditionalChecks = require("../Utility/runAdditionalChecks");
const getSiteName = require("../Utility/getSiteName"); // ✅ Import the new utility

async function navbarTitleCheckTest(page, selectedTests) {
  const filteredTitles = {}; // Store only relevant titles
  const links = await getNavbarLinks(page); // Fetch links once

  console.log("Found links:", links);

  // Get the `og:site_name` value once, instead of on every page
  const siteName = await getSiteName(page);
  console.log(`og:site_name detected: ${siteName}`);

  for (const link of links) {
    try {
      console.log(`Navigating to: ${link}`);
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Extract the page title
      const title = await page.title();
      console.log(`Title for ${link}: ${title}`);

      // Only add to results if the title does NOT contain `og:site_name`
      if (siteName && title.includes(siteName)) {
        console.log(`Skipping ${link} because title contains site_name`);
        continue; // Skip this page
      }

      // Store results only when title does not contain site_name
      filteredTitles[link] = { title };

      // Run additional tests dynamically, filtering out navbarTitleCheckTest
      const additionalTests = selectedTests.filter(
        (test) => test !== "navbarTitleCheckTest"
      );
      const additionalResults = await runAdditionalChecks(
        page,
        additionalTests
      );
      filteredTitles[link] = { ...filteredTitles[link], ...additionalResults };
    } catch (error) {
      console.error(`Error loading ${link}:`, error.message);
      filteredTitles[link] = { error: "Error loading page" };
    }
  }

  return filteredTitles;
}

module.exports = navbarTitleCheckTest;
