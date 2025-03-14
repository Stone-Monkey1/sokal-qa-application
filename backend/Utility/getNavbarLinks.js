let cachedLinks = null;

async function getNavbarLinks(page) {
  if (cachedLinks) return cachedLinks; // Reuse previously fetched links

  const links = await page.evaluate(() => {
    const navLinks = document.querySelectorAll(".navbar .navbar-nav a");
    const excludedKeywords = [
      "newvehicles",
      "preownedvehicles",
      "new-vehicles",
      "pre-owned-vehicles",
      "used-vehicles",
      "vehicles?"
    ];
    let hrefs = [...new Set([...navLinks].map((link) => link.href.trim()))];
    hrefs = hrefs.filter(
      (href) => !excludedKeywords.some((keyword) => href.includes(keyword))
    );
    return hrefs.filter((href) => href && !href.startsWith("#")); // Remove empty & anchor links
  });

  cachedLinks = links; // Store links so they are only fetched once
  return links;
}

module.exports = getNavbarLinks;
