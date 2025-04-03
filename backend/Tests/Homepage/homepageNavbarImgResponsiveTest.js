const getNavbarImages = require("../../Utility/getNavbarImages");

async function homepageNavbarImgResponsiveTest(page) {
  const url = page.url();

  try {
    console.log(`🔍 Checking navbar images for responsive class on ${url}`);

    const images = await getNavbarImages(page);

    if (images.length === 0) {
      console.log("✅ No navbar images found.");
      return null;
    }

    const missingResponsiveClass = [];

    for (const img of images) {
      const classList = await img.getAttribute("class");
      if (!classList || !classList.includes("img-responsive")) {
        const src = await img.getAttribute("src");
        missingResponsiveClass.push(src || "[no src attribute]");
      }
    }

    return missingResponsiveClass.length > 0
      ? {
          [url]: {
            homepageNavbarImgResponsiveTest: {
              imagesMissingResponsiveClass: missingResponsiveClass,
            },
          },
        }
      : null;
  } catch (error) {
    return {
      [url]: {
        error: `Error running navbar responsive class test: ${error.message}`,
      },
    };
  }
}

module.exports = homepageNavbarImgResponsiveTest;
