const { chromium } = require("playwright");

async function loadTimeTest(page) {
  const timing = await page.evaluate(() => performance.timing);
  return timing.loadEventEnd - timing.navigationStart;
}

module.exports = loadTimeTest;
