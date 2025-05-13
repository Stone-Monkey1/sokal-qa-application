async function homepageQuickLinksTest(page) {
  const url = page.url();
  console.log(`Running homepageQuickLinksTest on: ${url}`);

  // Check if the quick-links component exists
  const quickLinksComponent = await page
    .locator(".quick-links-component")
    .count();
  console.log(`Quick Links Component count: ${quickLinksComponent}`);

  if (quickLinksComponent === 0) {
    console.log(`Quick Links Component not found on ${url}`);
    return null; // Don't clutter results with unnecessary messages
  }

  console.log(`Quick Links Component found on ${url}`);

  // Select all quick links
  const quickLinks = await page.locator(".links-row a.quick-link").all();
  console.log(`Found ${quickLinks.length} quick links`);

  if (quickLinks.length === 0) {
    console.log(`No quick links found on ${url}`);
    return null;
  }

  const quickLinksData = {}; // Store extracted titles & links

  for (const linkElement of quickLinks) {
    try {
      // Extract the quick link title text
      const quickLinkVerbiage = await linkElement
        .locator(".quick-link__title")
        .textContent();
      console.log(`Extracted title: ${quickLinkVerbiage}`);

      // Extract the quick link URL
      const quickLinkUrl = await linkElement.getAttribute("href");
      console.log(`Extracted URL: ${quickLinkUrl}`);

      if (quickLinkVerbiage && quickLinkUrl) {
        quickLinksData[quickLinkVerbiage.trim()] = quickLinkUrl;
      } else {
        console.log(
          `Skipping a quick link due to missing data: ${quickLinkVerbiage}, ${quickLinkUrl}`
        );
      }
    } catch (error) {
      console.error(
        `Error extracting quick link data on ${url}:`,
        error.message
      );
    }
  }

  console.log(`Extracted quick links data:`, quickLinksData);

  // Return results only if quick links were found
  const result =
    Object.keys(quickLinksData).length > 0
      ? { [url]: { homepageQuickLinksTest: quickLinksData } }
      : null;

  console.log(`Final result for ${url}:`, result);
  return result;
}

module.exports = homepageQuickLinksTest;
