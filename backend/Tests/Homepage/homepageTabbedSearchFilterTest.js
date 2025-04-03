async function homepageTabbedSearchFilterTest(page) {
  const url = page.url();
  console.log(`Running homepageTabbedSearchFilterTest on: ${url}`);

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

  const tooltipValue = await excellentCredit.getAttribute(
    "data-original-title"
  );
  console.log(`Tooltip Value: ${tooltipValue}`);

  const filterResult = {};

  if (!tooltipValue || !tooltipValue.includes("7.09")) {
    console.log(`Tooltip does not contain 7.09% on ${url}`);
    filterResult["Tooltip Value"] = "Tooltip does not contain 7.09%";
  } else {
    console.log(`Tooltip contains 7.09% on ${url}`);
    filterResult["Tooltip Value"] = "Tooltip correctly contains 7.09%";
  }

  return {
    [url]: {
      homepageTabbedSearchFilterTest: filterResult,
    },
  };
}

module.exports = homepageTabbedSearchFilterTest;
