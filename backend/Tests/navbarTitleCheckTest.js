const getNavbarLinks = require("../Utility/getNavbarLinks");
const runAdditionalChecks = require("../Utility/runAdditionalChecks");

async function navbarTitleCheckTest(page, selectedTests) {
  const titles = {};
  const links = await getNavbarLinks(page); // Ensure links are fetched

  console.log("Found links:", links);

  for (const link of links) {
    try {
      console.log(`Navigating to: ${link}`);
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Extract and save the page title
      const title = await page.title();
      titles[link] = { title };

      console.log(`Title for ${link}: ${title}`);

      // Run additional tests dynamically, filtering out navbarTitleCheckTest
      const additionalTests = selectedTests.filter(
        (test) => test !== "navbarTitleCheckTest"
      );
      const additionalResults = await runAdditionalChecks(
        page,
        additionalTests
      );
      titles[link] = { ...titles[link], ...additionalResults };
    } catch (error) {
      console.error(`Error loading ${link}:`, error.message);
      titles[link] = { error: "Error loading page" };
    }
  }

  return titles;
}

module.exports = navbarTitleCheckTest;
