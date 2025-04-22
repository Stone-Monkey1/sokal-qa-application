async function navbarImgAltTagTest(page, images) {
  const url = page.url();

  try {
    console.log(`Checking alt tag usage on ${url}`);

    if (images.length === 0) {
      return null; // No images on the page, return nothing
    }

    const altTags = [];
    const missingAltTags = [];
    const { isBlacklistedImage } = require("../../Utility/imageBlacklist");

    for (const img of images) {
      const imgSrc = await img.getAttribute("src");

      if (isBlacklistedImage(imgSrc)) continue;
      
      const altText = await img.getAttribute("alt");

      if (altText) {
        altTags.push(altText);
      } else {
        missingAltTags.push({
          imageSrc: imgSrc || "No src attribute",
          error: "Missing alt tag",
        });
      }
    }

    return altTags.length === 0 && missingAltTags.length === 0
      ? null
      : {
          [url]: {
            navbarImgAltTagTest: {
              altTags: altTags.length > 0 ? altTags : null,
              missingAltTags: missingAltTags.length > 0 ? missingAltTags : null,
            },
          },
        };
  } catch (error) {
    return { [url]: { error: `Error loading page: ${error.message}` } };
  }
}

module.exports = navbarImgAltTagTest;
