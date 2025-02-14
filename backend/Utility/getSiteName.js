async function getSiteName(page) {
  return await page.evaluate(() => {
    const metaTag = document.querySelector('meta[property="og:site_name"]');
    return metaTag ? metaTag.getAttribute("content") : null;
  });
}

module.exports = getSiteName;
