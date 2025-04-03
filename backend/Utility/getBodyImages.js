async function getBodyImages(page) {
  await page.waitForLoadState("domcontentloaded");

  console.log(`Fetching images from ${page.url()}`);

  // Get all visible <img> elements NOT inside .navbar
  const images = await page.locator("img:not(.navbar img)").all();

  const filteredImages = [];

  for (const img of images) {
    const insideNavbar = await img.evaluate(
      (el) => el.closest(".navbar") !== null
    );

    const insideHead = await img.evaluate((el) =>
      el.ownerDocument.head.contains(el)
    );

    if (!insideNavbar && !insideHead) {
      filteredImages.push(img);
    }
  }

  return filteredImages;
}

module.exports = getBodyImages;
