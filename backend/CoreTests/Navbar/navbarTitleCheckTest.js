async function navbarTitleCheckTest(page) {
  const url = page.url();

  try {
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    console.log(`Title for ${url}: ${title}`);

    return { [url]: { navbarPageTitles: { title } } };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.message);
    return { [url]: { error: `Error loading page: ${error.message}` } };
  }
}

module.exports = navbarTitleCheckTest;
