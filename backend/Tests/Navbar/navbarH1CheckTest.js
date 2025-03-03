const { chromium } = require("playwright");
async function navbarH1CheckTest(page) {
  // console.log(page.url())
  try {
    await page.waitForLoadState("domcontentloaded");
    const url = page.url();

    console.log(`Checking <h1> on ${url}`);
    const h1Count = await page.locator("h1").count();

    return {
      [url]: {
        navbarH1CheckTest:
          h1Count === 0 ? { error: "Missing <h1>" }
          : h1Count > 1 
          ? { warning: `Multiple <h1> tags detected (${h1Count})` }
          : { results: "H1 exists" },
      },
    };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.results);
    return { [url]: { error: `Error loading page: ${error.results}` } };
  }
}

module.exports = navbarH1CheckTest;
