async function navbarImgResponsiveTest(page, images) {
  const url = page.url();

  try {
    console.log(`Checking for missing img-responsive class on ${url}`);

    const missingResponsiveClass = [];
    const { isBlacklistedImage } = require("../../Utility/imageBlacklist");

    for (const img of images) {
      const src = await img.getAttribute("src");
      
      if (isBlacklistedImage(src)) continue;

      const classList = await img.getAttribute("class");
      if (!classList || !classList.includes("img-responsive")) {
        missingResponsiveClass.push(src || "[no src attribute]");
      }
    }

    return missingResponsiveClass.length > 0
      ? {
          [url]: {
            navbarImgResponsiveTest: {
              imagesMissingResponsiveClass: missingResponsiveClass,
            },
          },
        }
      : null;
  } catch (error) {
    return { [url]: { error: `Error loading page: ${error.message}` } };
  }
}

module.exports = navbarImgResponsiveTest;
