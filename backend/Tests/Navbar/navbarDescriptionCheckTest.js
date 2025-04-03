async function navbarDescriptionCheckTest(page) {
  const url = page.url();

  try {
    await page.waitForLoadState("domcontentloaded");

    const metaDescription = page.locator('meta[name="description"]');

    const metaDescriptionCount = await metaDescription.count();
    let description;

    if (metaDescriptionCount === 0) {
      description = null;
    } else {
      description = await metaDescription.first().getAttribute("content");
    }

    console.log(`Description for ${url}: ${description || "None found"}`);

    return {
      [url]: {
        navbarPageDescription: {
          description: description || "No description meta tag found",
        },
      },
    };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.message);
    return { [url]: { error: `Error loading page: ${error.message}` } };
  }
}

module.exports = navbarDescriptionCheckTest;
