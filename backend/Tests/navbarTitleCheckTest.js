const { chromium } = require("playwright");
const getNavbarLinks = require("../Utility/getNavbarLinks"); // Import function

async function navbarTitleCheckTest(page) {
  const titles = {};
  const links = await getNavbarLinks(page); // Use the function here

  console.log("Found links:", links);

  for (const link of links) {
    try {
      console.log(`Navigating to: ${link}`);
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Extract and save the page title
      const title = await page.title();
      titles[link] = title;

      console.log(`Title for ${link}: ${title}`);
    } catch (error) {
      console.error(`Error loading ${link}:`, error.message);
      titles[link] = "Error loading page";
    }
  }

  return titles;
}

module.exports = navbarTitleCheckTest;
