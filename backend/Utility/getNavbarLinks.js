async function getNavbarLinks(page) {
  console.log("Fetching fresh navbar links...");
  const baseHost = new URL(page.url()).host;

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
      "specials",
    ];

    return [...new Set([...navLinks].map((link) => link.href.trim()))].filter(
      (href) =>
        href &&
        !href.startsWith("#") &&
        !excludedKeywords.some((keyword) => href.includes(keyword))
    );
  });

  return links.map((link) => {
    const linkHost = new URL(link).host;
    return {
      url: link,
      isOffSite: linkHost !== baseHost,
    };
  });
}

module.exports = getNavbarLinks;
