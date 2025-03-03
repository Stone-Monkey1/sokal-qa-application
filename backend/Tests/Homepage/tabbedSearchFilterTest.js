async function tabbedSearchFilterTest(page) {

  const tabbedSearchComponent = await page.locator(".tabbed-filter-content").count();

  if (tabbedSearchComponent === 0) {
    console.log("Tabbed Search not on Homepage");
    return { error: "Tabbed Search not on Homepage" };
  }

  const excellentCredit = await page.locator(
    "a[aria-controls='monthlyPaymentFilter'] span[data-toggle='tooltip']"
  );

  const isElementPresent = await excellentCredit.count();

  if (isElementPresent === 0) {
    console.log("Excellent Credit Tooltip not found.");
    return { error: "Excellent Credit Tooltip not found" };
  }

  const tooltipValue = await excellentCredit.getAttribute(
    "data-original-title"
  );

  if (tooltipValue && tooltipValue.includes("7.09")) {
    console.log("Tooltip contains 7.09%");
    return { result: "Tooltip contains 7.09%" };
  } else {
    console.log("Tooltip does not contain 7.09%");
    return { result: "Tooltip does not contain 7.09%" };
  }
}

module.exports = tabbedSearchFilterTest;

<iframe src="https://player.vimeo.com/video/1060931431?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="1920" height="1080" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title="haki2502_hero (1080p)"></iframe>