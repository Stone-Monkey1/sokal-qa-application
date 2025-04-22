async function getBodyImages(page) {
  await page.waitForLoadState("domcontentloaded");

  console.log(`Fetching images from ${page.url()}`);

  // Get all <img> elements on the page
  const allImages = await page.locator("img").all();

  const filteredImages = [];

  for (const img of allImages) {
    const isInsideExcludedContainer = await img.evaluate((el) => {
      const excludedSelectors = [
        ".navbar",
        "nav",
        "header",
        ".top-header",
        ".nav-contact-toolbar",
        ".model-container",
        ".extruder-content"
      ];

      return excludedSelectors.some((selector) => el.closest(selector));
    });

    const isInHead = await img.evaluate((el) =>
      el.ownerDocument.head.contains(el)
    );

    if (!isInsideExcludedContainer && !isInHead) {
      filteredImages.push(img);
    }
  }

  return filteredImages;
}

module.exports = getBodyImages;
