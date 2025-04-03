async function getNavbarLinks(page) {
  console.log("Fetching fresh navbar links...");

  const links = await page.evaluate(() => {
    const navLinks = document.querySelectorAll(".navbar .navbar-nav a");
    const excludedKeywords = [
      "newvehicles",
      "preownedvehicles",
      "new-vehicles",
      "pre-owned-vehicles",
      "used-vehicles",
      "usedvehicles",
      "vehicles?",
      "new-inventory",
      "used-inventory",
      "specials"
    ];

    let hrefs = [...new Set([...navLinks].map((link) => link.href.trim()))];

    hrefs = hrefs.filter(
      (href) => !excludedKeywords.some((keyword) => href.includes(keyword))
    );

    return hrefs.filter((href) => href && !href.startsWith("#")); // Remove empty & anchor links
  });

  return links;
}

module.exports = getNavbarLinks;
