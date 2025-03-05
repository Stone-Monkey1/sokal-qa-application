async function homepageTabbedSearchFilterTest(page) {
  const tabbedSearchFilter = await page
    .locator(".vehicle-type-display")
    .count();

  if (tabbedSearchFilter === 0) {
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

module.exports = homepageTabbedSearchFilterTest;
