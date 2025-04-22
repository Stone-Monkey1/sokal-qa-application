const { launchPage } = require("./browserContext");
const getNavbarLinks = require("./getNavbarLinks");
const { normalizeUrlKey } = require("./normalize");

function highlightMatches(html, phrases) {
  let highlighted = html;
  phrases.forEach((phrase) => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    highlighted = highlighted.replace(regex, `<mark>$1</mark>`);
  });
  return highlighted;
}

async function websiteKeywordSearch(siteUrl, keywordString) {
  const { browser, page } = await launchPage();
  const keywords = keywordString
    .split("~")
    .map((k) => k.trim())
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

  const allPages = [siteUrl, ...navbarLinks.filter((link) => link !== siteUrl)];

  for (const link of allPages) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 40000 });
    } catch (err) {
      const key = normalizeUrlKey(link);
      results[key] = [
        {
          url: link,
          tag: null,
          keyword: null,
          snippet: `<p style="color:red;">Page load failed: ${err.message}</p>`,
        },
      ];
      continue;
    }

    const found = await page.evaluate((keywords) => {
      const matches = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT
      );

      let node;
      while ((node = walker.nextNode())) {
        if (
          ["P", "H1", "H2", "H3", "LI", "SPAN", "DIV"].includes(node.tagName) &&
          node.innerText
        ) {
          const text = node.innerText.toLowerCase();
          const foundKeyword = keywords.find((kw) =>
            text.includes(kw.toLowerCase())
          );
          if (foundKeyword) {
            matches.push({
              tag: node.tagName,
              text: node.innerText.trim(),
              keyword: foundKeyword,
            });
          }
        }
      }

      return matches;
    }, keywords);

    const key = normalizeUrlKey(link);
    results[key] = results[key] || [];

    found.forEach((match) => {
      results[key].push({
        url: link,
        tag: match.tag,
        keyword: match.keyword,
        snippet: match.text,
      });
    });
  }

  await browser.close();
  const wrappedResults = {};

  for (const [url, matches] of Object.entries(results)) {
    wrappedResults[url] = {
      keywordSearchResults: {
        keywordMatches: matches.length
          ? matches
          : ["No keyword matches found."],
      },
    };
  }
  return wrappedResults;
}

module.exports = websiteKeywordSearch;
