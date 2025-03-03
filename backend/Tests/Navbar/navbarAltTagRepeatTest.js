async function navbarAltTagRepeatTest(page) {
  const url = page.url();

  try {
    await page.waitForLoadState("domcontentloaded");

    console.log(`Checking alt tag usage on ${url}`);

    // Track occurrences of each alt tag
    const altTagCounts = {};
    const images = await page.locator("img").all();

    for (const img of images) {
      const altText = await img.getAttribute("alt");
      if (altText) {
        altTagCounts[altText] = (altTagCounts[altText] || 0) + 1;
      }
    }

    // Identify repeated alt tags
    const repeatedTags = Object.entries(altTagCounts)
      .filter(([_, count]) => count > 1)
      .map(([altText]) => altText);

    console.log(
      repeatedTags.length > 0
        ? `Repeated alt tags found on ${url}: ${repeatedTags}`
        : `No repeated alt tags found on ${url}`
    );

    return {
      [url]: {
        navbarAltTagRepeatTest:
          repeatedTags.length > 0
            ? { repeatedAltTags: repeatedTags }
            : { results: "No repeated alt tags" },
      },
    };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.results);
    return { [url]: { error: `Error loading page: ${error.results}` } };
  }
}

module.exports = navbarAltTagRepeatTest;
