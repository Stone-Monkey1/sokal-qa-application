const { launchPage } = require("../Utility/browserContext");
const {
  normalizeUrlKey,
  normalizeTestResultKeys,
} = require("../Utility/normalize");

module.exports = async function runWebsiteTests(
  url,
  selectedTests,
  testMaps,
  getBodyImages
) {
  const { homepageTests, navbarTests, navbarImgTests, getNavbarLinks } =
    testMaps;
  const results = {};
  const executedTests = new Set();

  const { browser, page } = await launchPage();
  const homepageKey = normalizeUrlKey(url);
  results[homepageKey] = {};

  await page.goto(url, { timeout: 30000, waitUntil: "domcontentloaded" });

  const navbarLinkObjects = await getNavbarLinks(page);

  const allPages = [
    { url, isOffSite: false },
    ...navbarLinkObjects.filter(
      ({ url: link }) => normalizeUrlKey(link) !== homepageKey
    ),
  ];
  const imageTestsSelected = Object.keys(navbarImgTests).some((t) =>
    selectedTests.includes(t)
  );

  for (const testName of selectedTests) {
    if (homepageTests[testName]) {
      const result = await homepageTests[testName](page);
      const normalized = normalizeTestResultKeys(result || {}, normalizeUrlKey);
      results[homepageKey] = {
        ...results[homepageKey],
        ...normalized[homepageKey],
      };
    }
  }

  for (const { url: linkUrl, isOffSite } of allPages) {
    const key = normalizeUrlKey(linkUrl);

    if (isOffSite) {
      results[key] = { message: "Link is Off-Site" };
      continue;
    }
    try {
      await page.goto(linkUrl, {
        waitUntil: "domcontentloaded",
        timeout: 40000,
      });
    } catch {
      results[key] = { error: "Page load timeout" };
      continue;
    }
    results[key] = results[key] || {};
    let images = null;
    if (imageTestsSelected) images = await getBodyImages(page);

    for (const testName of selectedTests) {
      if (homepageTests[testName]) continue;
      const testKey = `${testName}-${linkUrl}`;
      if (executedTests.has(testKey)) continue;
      executedTests.add(testKey);

      let result;
      if (navbarTests[testName]) {
        result = await navbarTests[testName](page);
      } else if (navbarImgTests[testName]) {
        result = await navbarImgTests[testName](page, images);
      }
      const normalized = normalizeTestResultKeys(result || {}, normalizeUrlKey);
      results[key] = { ...results[key], ...normalized[key] };
    }
  }

  await browser.close();
  return results;
};
