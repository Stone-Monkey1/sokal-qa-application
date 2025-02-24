const getNavbarLinks = require("../Utility/getNavbarLinks");
const runAdditionalChecks = require("../Utility/runAdditionalChecks");

async function navbarAltTagRepeatTest(page, selectedTests) {
  const repeatedAltTags = {}; // Store only repeated alt tags
  const links = await getNavbarLinks(page); // Fetch links once

  console.log("Found links:", links);

  for (const link of links) {
    try {
      console.log(`Navigating to: ${link}`);
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Track alt tags found on this page
      const altTagCounts = {};

      // Find all images on the page
      const images = await page.locator("img").all();

      for (const img of images) {
        const altText = await img.getAttribute("alt");

        if (altText) {
          // Count occurrences of each alt tag
          altTagCounts[altText] = (altTagCounts[altText] || 0) + 1;
        }
      }

      // Filter to store only repeated alt tags
      const repeatedTags = Object.entries(altTagCounts)
        .filter(([_, count]) => count > 1)
        .map(([altText]) => altText);

      if (repeatedTags.length > 0) {
        repeatedAltTags[link] = { repeatedAltTags: repeatedTags };
        console.log(`Repeated alt tags found on ${link}:`, repeatedTags);
      } else {
        console.log(`No repeated alt tags found on ${link}`);
      }

      // Run additional tests dynamically, excluding this test
      const additionalTests = selectedTests.filter(
        (test) => test !== "navbarAltTagRepeatTest"
      );
      const additionalResults = await runAdditionalChecks(
        page,
        additionalTests
      );

      // Merge results if this page has repeated alt tags
      if (repeatedAltTags[link]) {
        repeatedAltTags[link] = {
          ...repeatedAltTags[link],
          ...additionalResults,
        };
      }
    } catch (error) {
      console.error(`Error loading ${link}:`, error.message);
      repeatedAltTags[link] = { error: "Error loading page" };
    }
  }

  return repeatedAltTags;
}

module.exports = navbarAltTagRepeatTest;
