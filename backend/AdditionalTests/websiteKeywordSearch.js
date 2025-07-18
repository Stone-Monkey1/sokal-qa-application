const { launchPage } = require("../Utility/browserContext");
const getNavbarLinks = require("../Utility/getNavbarLinks");
const { normalizeUrlKey } = require("../Utility/normalize");

async function websiteKeywordSearch(siteUrl, keywordString, mode = "website") {
  const { browser, page } = await launchPage();
  const keywords = keywordString
    .split("~")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const results = {};

  try {
    await page.goto(siteUrl, { timeout: 30000, waitUntil: "domcontentloaded" });
  } catch (err) {
    await browser.close();
    throw new Error(`Initial page load failed for ${siteUrl}: ${err.message}`);
  }

  let navbarLinks = [];
  try {
    navbarLinks = await getNavbarLinks(page);
  } catch (err) {
    console.warn("Failed to extract navbar links:", err);
  }
  const allPages =
    mode === "single"
      ? [siteUrl]
      : [
    siteUrl,
    ...navbarLinks
      .map((obj) => (typeof obj === "string" ? obj : obj.url))
      .filter((url) => url && url !== siteUrl)
  ];


  for (const link of allPages) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 40000 });
    } catch (err) {
      results[normalizeUrlKey(link)] = {
        keywordCounts: { error: `Page load failed: ${err.message}` },
      };
      continue;
    }

    const counts = await page.evaluate((keywords) => {
      const countMap = {};
      keywords.forEach((kw) => (countMap[kw] = 0));

      const html = document.body.outerHTML.toLowerCase();

      keywords.forEach((kw) => {
        const matches = html.match(
          new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
        );
        if (matches) {
          countMap[kw] += matches.length;
        }
      });

      return countMap;
    }, keywords);

    const totalMatches = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );
    if (totalMatches > 0) {
      results[normalizeUrlKey(link)] = {
        keywordCounts: counts,
      };
    }
  }

  await browser.close();
  return results;
}

module.exports = websiteKeywordSearch;
