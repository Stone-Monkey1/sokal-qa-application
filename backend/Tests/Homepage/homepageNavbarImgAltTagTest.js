const getNavbarImages = require("../../Utility/getNavbarImages");

async function homepageNavbarImgAltTagTest(page) {
  const url = page.url();

  try {
    console.log(`🔍 Checking alt tags in navbar images on ${url}`);

    const images = await getNavbarImages(page);

    if (images.length === 0) {
      console.log("✅ No navbar images found.");
      return null;
    }

    const altTags = [];
    const missingAltTags = [];

    for (const img of images) {
      const altText = await img.getAttribute("alt");
      const imgSrc = await img.getAttribute("src");

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
            homepageNavbarImgAltTagTest: {
              altTags: altTags.length > 0 ? altTags : null,
              missingAltTags: missingAltTags.length > 0 ? missingAltTags : null,
            },
          },
        };
  } catch (error) {
    return {
      [url]: { error: `Error running navbar alt tag test: ${error.message}` },
    };
  }
}

module.exports = homepageNavbarImgAltTagTest;
