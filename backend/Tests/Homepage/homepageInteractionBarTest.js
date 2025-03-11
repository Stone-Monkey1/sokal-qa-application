async function homepageInteractionBarTest(page) {
  const url = page.url();
  console.log(`Running homepageInteractionBarTest on: ${url}`);

  // Check if the interaction bar component exists
  const interactionBarComponentCount = await page
    .locator("#interactionBarComponent")
    .count();
  console.log(
    `Interaction Bar Component count: ${interactionBarComponentCount}`
  );

  if (interactionBarComponentCount === 0) {
    console.log(`Interaction Bar Component not found on ${url}`);
    return null; // Don't clutter results with unnecessary messages
  }

  console.log(`Interaction Bar Component found on ${url}`);

  // Get all interaction bar links
  const allInteractionBarLinks = await page
    .locator("#interactionBarComponent .interaction-bar .scroll-item a")
    .all();

  // ✅ Only keep visible elements
  const interactionBarLinks = [];
  for (const link of allInteractionBarLinks) {
    if (await link.isVisible()) {
      interactionBarLinks.push(link);
    }
  }

  console.log(
    `Found ${interactionBarLinks.length} visible interaction bar buttons`
  );

  if (interactionBarLinks.length === 0) {
    console.log(`No visible interaction bar buttons found on ${url}`);
    return null;
  }

  const interactionBarData = {}; // Store extracted titles & links

  for (const link of interactionBarLinks) {
    try {
      // Extract the quick link title text
      const interactionBarVerbiage = await link
        .locator(".ibar-btn__label")
        .textContent();
      console.log(`Extracted label: ${interactionBarVerbiage}`);

      // Extract the quick link URL
      const interactionBarUrl = await link.getAttribute("href");
      console.log(`Extracted URL: ${interactionBarUrl}`);

      if (interactionBarVerbiage && interactionBarUrl) {
        interactionBarData[interactionBarVerbiage.trim()] = interactionBarUrl;
      } else {
        console.log(
          `Skipping an interaction bar button due to missing data: ${interactionBarVerbiage}, ${interactionBarUrl}`
        );
      }
    } catch (error) {
      console.error(
        `Error extracting interaction bar data on ${url}:`,
        error.message
      );
    }
  }

  console.log(`Extracted interaction bar data:`, interactionBarData);

  // Return results only if quick links were found
  const result =
    Object.keys(interactionBarData).length > 0
      ? { [url]: { homepageInteractionBarTest: interactionBarData } }
      : null;

  console.log(`Final result for ${url}:`, result);
  return result;
}

module.exports = homepageInteractionBarTest;
