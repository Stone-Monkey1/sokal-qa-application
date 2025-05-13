async function navbarImgAltTagRepeatTest(page, images) {
  const url = page.url();

  try {
    console.log(`Checking alt tag usage on ${url}`);

    const altTagCounts = {};
    for (const img of images) {
      const altText = await img.getAttribute("alt");
      if (altText) {
        altTagCounts[altText] = (altTagCounts[altText] || 0) + 1;
      }
    }

    const repeatedTags = Object.entries(altTagCounts)
      .filter(([_, count]) => count > 1)
      .map(([altText]) => altText);

    return repeatedTags.length > 0
      ? {
          [url]: {
            navbarImgAltTagRepeatTest: { repeatedAltTags: repeatedTags },
          },
        }
      : null;
  } catch (error) {
    return { [url]: { error: `Error loading page: ${error.message}` } };
  }
}

module.exports = navbarImgAltTagRepeatTest;
