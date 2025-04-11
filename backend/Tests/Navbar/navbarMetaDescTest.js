async function navbarMetaDescTest(page) {
  const url = page.url()

  try {
    await page.waitForLoadState("domcontentloaded")

    const metaDescription = await page.locator('head > meta[name="description"]').getAttribute('content')

    console.log(`Meta description for ${url}:`, metaDescription)

    let result;
    if (!metaDescription || metaDescription.trim() === "") {
      result = { warning: "Missing or empty meta description" }
    } else {
      result = { metaDescription }
    }

    return {
      [url]: {
        navbarMetaDescTest: result,
      },
    };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.message)
    return { [url]: { error: `Error loading page: ${error.message}` } }
  }
}

module.exports = navbarMetaDescTest;