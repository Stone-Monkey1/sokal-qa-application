const { chromium } = require("playwright");

module.exports.launchPage = async function () {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  });
  await context.clearCookies();
  await context.clearPermissions();
  const page = await context.newPage();
  return { browser, context, page };
};
