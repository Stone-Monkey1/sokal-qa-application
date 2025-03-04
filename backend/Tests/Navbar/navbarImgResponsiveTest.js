async function navbarImgResponsiveTest(page, images) {
  const url = page.url();

  try {
    console.log(`Checking for missing img-responsive class on ${url}`);

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