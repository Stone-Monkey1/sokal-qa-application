async function navbarCheckVideo(page) {
  const url = page.url();

  try {
    await page.waitForSelector("iframe", { timeout: 5000 }).catch(() => {}); // Prevent test failures if no iframe exists
    await page.waitForTimeout(800); // Extra wait for lazy-loaded content

    console.log(`Checking for video iframes on ${url}`);

    const videoIframes = [];
    const iframes = await page.locator("iframe").all();

    for (const iframe of iframes) {
      try {
        const src = await iframe.getAttribute("src");

        if (src && (src.includes("youtube") || src.includes("vimeo"))) {
          console.log(`YouTube/Vimeo iframe found on ${url}: ${src}`);
          videoIframes.push(src);
        }
      } catch (error) {
        console.error(`Error retrieving iframe src on ${url}:`, error.message);
      }
    }

    console.log(
      videoIframes.length > 0
        ? `Video iframes found on ${url}: ${videoIframes}`
        : `No video iframes found on ${url}`
    );
    return videoIframes.length > 0
      ? { [url]: { navbarCheckVideo: { videoIframes: videoIframes } } }
      : null;
  } catch (error) {
    console.error(`Error loading ${url}:`, error.message);
    return { [url]: { error: `Error loading page: ${error.message}` } };
  }
}

module.exports = navbarCheckVideo;


