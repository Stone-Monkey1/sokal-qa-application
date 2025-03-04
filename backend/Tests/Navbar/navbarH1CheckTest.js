const { chromium } = require("playwright");
async function navbarH1CheckTest(page) {

  try {
    await page.waitForLoadState("domcontentloaded");
    // await page.waitForLoadState("networkidle");
    const url = page.url();

    console.log(`Checking <h1> on ${url}`);
    const h1Elements = await page.locator("h1").all();
    const h1TextContentList = await Promise.all(h1Elements.map(async (el) => await el.innerText()))
    const h1Count = h1TextContentList.length;

    console.log(`Found ${h1Count} <h1> tag(s) on ${url}`);
    console.log(`H1 Text List: ${h1TextContentList}`);

    let result;
    if (h1Count === 0) {
      result = { Error: "Missing <h1>" };
    } else if (h1Count > 1) {
      result = { 
        Warning: `Multiple <h1> tags detected (${h1Count})`, 
        h1TextContentList, 
        Resolution: `Please convert one of these h1 tags to an h2 or higher for SEO compliance` 
      };
    } else {
      result = { Results: "H1 exists" };
    }

    return {
      [url]: {
        navbarH1CheckTest: result,
      },
    };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.results);
    return { [url]: { error: `Error loading page: ${error.results}` } };
  }
}

module.exports = navbarH1CheckTest;
