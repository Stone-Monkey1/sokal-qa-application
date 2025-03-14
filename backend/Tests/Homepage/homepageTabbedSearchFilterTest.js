async function homepageTabbedSearchFilterTest(page) {
  const url = page.url();
  console.log(`Running homepageTabbedSearchFilterTest on: ${url}`);

  // Ensure Tabbed Search Filter exists
  const tabbedSearchFilterCount = await page
    .locator(".vehicle-type-display")
    .count();
  console.log(
    `Tabbed Search Filter Component count: ${tabbedSearchFilterCount}`
  );

  if (tabbedSearchFilterCount === 0) {
    console.log(`Tabbed Search not found on ${url}`);
    return null;
  }

  console.log(`Tabbed Search found on ${url}`);

  // Locate the Excellent Credit tooltip
  const excellentCredit = await page.locator(
    "a[aria-controls='monthlyPaymentFilter'] span[data-toggle='tooltip']"
  );
  const isElementPresent = await excellentCredit.count();

  if (isElementPresent === 0) {
    console.log(`Excellent Credit Tooltip not found on ${url}`);
    return {
      [url]: {
        homepageTabbedSearchFilterTest: {
          error: "Excellent Credit Tooltip not found",
        },
      },
    };
  }

  // Extract tooltip value
  const tooltipValue = await excellentCredit.getAttribute(
    "data-original-title"
  );
  console.log(`Tooltip Value: ${tooltipValue}`);

  // Error tracking
  const filterErrors = {};

  if (!tooltipValue || !tooltipValue.includes("7.09")) {
    console.log(`Tooltip does not contain 7.09% on ${url}`);
    filterErrors["Tooltip Value"] = "Tooltip does not contain 7.09%";
  } else {
    console.log(`Tooltip contains 7.09% on ${url}`);
  }

  // Return results only if errors exist
  const result =
    Object.keys(filterErrors).length > 0
      ? { [url]: { homepageTabbedSearchFilterTest: filterErrors } }
      : null;

  console.log(`Final result for ${url}:`, result);
  return result;
}

module.exports = homepageTabbedSearchFilterTest;
