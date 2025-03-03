async function navbarH1CheckTest(page) {
  const url = page.url();

  try {
    await page.waitForLoadState("domcontentloaded");

    console.log(`Checking <h1> on ${url}`);
    const h1Count = await page.locator("h1").count();

    return {
      [url]: {
        navbarH1CheckTest:
          h1Count === 0 ? { error: "Missing <h1>" } : { results: "H1 exists" },
      },
    };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.results);
    return { [url]: { error: `Error loading page: ${error.results}` } };
  }
}

module.exports = navbarH1CheckTest;
