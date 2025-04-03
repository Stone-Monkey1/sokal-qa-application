async function getNavbarImages(page) {
  await page.waitForLoadState("domcontentloaded");

  console.log(`Fetching navigation images from ${page.url()}`);

  const images = await page.locator(".navbar img").all();

  const navigationImages = [];
  for (const img of images) {
    navigationImages.push(img);
  }

  return navigationImages;
}

module.exports = getNavbarImages;
