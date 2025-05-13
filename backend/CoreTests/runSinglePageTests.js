const { launchPage } = require("../Utility/browserContext");
const {
  normalizeUrlKey,
  normalizeTestResultKeys,
} = require("../Utility/normalize");

module.exports = async function runSinglePageTests(
  url,
  selectedTests,
  testMaps,
  getBodyImages
) {
  const { homepageTests, navbarTests, navbarImgTests } = testMaps;
  const results = {};
  const executedTests = new Set();
  const homepageKey = normalizeUrlKey(url);

  const { browser, page } = await launchPage();
  await page.goto(url, { timeout: 30000, waitUntil: "domcontentloaded" });

  let images = null;
  const imageTestsSelected = Object.keys(navbarImgTests).some((t) =>
    selectedTests.includes(t)
  );
  if (imageTestsSelected) images = await getBodyImages(page);

  for (const testName of selectedTests) {
    const testKey = `${testName}-${url}`;
    if (executedTests.has(testKey)) continue;
    executedTests.add(testKey);

    let result;
    if (homepageTests[testName]) {
      result = await homepageTests[testName](page);
    } else if (navbarTests[testName]) {
      result = await navbarTests[testName](page);
    } else if (navbarImgTests[testName]) {
      result = await navbarImgTests[testName](page, images);
    }

    const normalized = normalizeTestResultKeys(result || {}, normalizeUrlKey);
    results[homepageKey] = {
      ...results[homepageKey],
      ...normalized[homepageKey],
    };
  }

  await browser.close();
  return results;
};
