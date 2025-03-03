const getSiteName = require("../../Utility/getSiteName");

let siteNameCache = null;

async function navbarTitleCheckTest(page, selectedTests, navbarLinks) {
  const url = page.url();

  if (!siteNameCache) {
    siteNameCache = await getSiteName(page);
    console.log(`og:site_name detected: ${siteNameCache}`);
  }
  try {
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    console.log(`Title for ${url}: ${title}`);

    if (siteNameCache && title.includes(siteNameCache)) {
      console.log(`Skipping ${url} because title contains site_name`);
      return { [url]: {} };
    }

    return { [url]: { navbarPageTitles: { title } } };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.message);
    return { [url]: { error: `Error loading page: ${error.message}` } };
  }
}

module.exports = navbarTitleCheckTest;
