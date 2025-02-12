const { chromium } = require("playwright");

async function titleCheckTest(page) {
  return await page.title();
}

module.exports = titleCheckTest;
