async function getImages(page) {
  await page.waitForLoadState("domcontentloaded");

  console.log(`Fetching images from ${page.url()}`);

  // Get all images
  const images = await page.locator("img").all();
  return images;
}

module.exports = getImages;
