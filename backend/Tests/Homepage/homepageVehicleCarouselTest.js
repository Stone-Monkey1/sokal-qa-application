async function homepageVehicleCarouselTest(page) {
  const url = page.url();
  console.log(`Running homepageVehicleCarouselTest on: ${url}`);

  // Ensure carousel exists
  const vehicleCarouselComponent = await page
    .locator(".vehicle-type-display")
    .count();
  console.log(`Vehicle Carousel Component count: ${vehicleCarouselComponent}`);

  if (vehicleCarouselComponent === 0) {
    console.log(`Vehicle Carousel Component not found on ${url}`);
    return null;
  }

  console.log(`Vehicle Carousel Component found on ${url}`);

  // Wait for both carousels to load
  await Promise.all([
    page
      .waitForSelector(".tab-content .visible-xs a", { timeout: 5000 })
      .catch(() => console.log("Mobile carousel not found")),
    page
      .waitForSelector(".tab-content .hidden-xs a", { timeout: 5000 })
      .catch(() => console.log("Desktop carousel not found")),
  ]);

  // Select all vehicles from both carousels
  const mobileVehicles = await page.locator(".tab-content .visible-xs a").all();
  const desktopVehicles = await page.locator(".tab-content .hidden-xs a").all();

  console.log(`Found ${mobileVehicles.length} mobile vehicles`);
  console.log(`Found ${desktopVehicles.length} desktop vehicles`);

  if (mobileVehicles.length === 0 && desktopVehicles.length === 0) {
    console.log(`No vehicles found in any carousel on ${url}`);
    return null;
  }

  const vehicleErrors = {}; // Store errors

  // Helper function to process each vehicle
  async function processVehicle(linkElement, source) {
    try {
      let vehicleNameElement = await linkElement.locator("p");
      let vehicleName =
        (await vehicleNameElement.count()) > 0
          ? (await vehicleNameElement.textContent()).trim()
          : "[Missing Vehicle Name]";

      console.log(`[${source}] Extracted vehicle title: ${vehicleName}`);

      // Get vehicle URL
      const vehicleUrl =
        (await linkElement.getAttribute("href")) || "[Missing URL]";
      console.log(`[${source}] Extracted URL: ${vehicleUrl}`);

      if (
        vehicleName === "[Missing Vehicle Name]" ||
        vehicleUrl === "[Missing URL]"
      ) {
        console.log(`[${source}] Skipping vehicle due to missing data.`);
        return;
      }

      // Ensure URL routes to new vehicles
      if (
        !vehicleUrl.includes("newvehicles") &&
        !vehicleUrl.includes("new-vehicles") &&
        !vehicleUrl.includes("new-true")
      ) {
        if (!vehicleErrors[vehicleName]) {
          vehicleErrors[vehicleName] = [];
        }
        vehicleErrors[vehicleName].push(
          `Error (${source}): URL does not route to new vehicles (${vehicleUrl})`
        );
        return;
      }

      // Format vehicle name for URL checking (replace spaces with "%20")
      const formattedVehicleName = encodeURIComponent(vehicleName);

      // Check if the formatted vehicle name appears in the URL
      if (!vehicleUrl.includes(formattedVehicleName)) {
        if (!vehicleErrors[vehicleName]) {
          vehicleErrors[vehicleName] = [];
        }
        vehicleErrors[vehicleName].push(
          `Error (${source}): Vehicle name not found in URL (${vehicleUrl})`
        );
      }
    } catch (error) {
      console.error(
        `Error processing a vehicle link on ${url}:`,
        error.message
      );
    }
  }

  // Process all mobile vehicles
  for (const linkElement of mobileVehicles) {
    await processVehicle(linkElement, "Mobile");
  }

  // Process all desktop vehicles
  for (const linkElement of desktopVehicles) {
    await processVehicle(linkElement, "Desktop");
  }

  // Return results only if errors exist
  const result =
    Object.keys(vehicleErrors).length > 0
      ? { [url]: { homepageVehicleCarouselTest: vehicleErrors } }
      : null;

  console.log(`Final result for ${url}:`, result);
  return result;
}

module.exports = homepageVehicleCarouselTest;
