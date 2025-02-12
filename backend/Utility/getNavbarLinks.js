async function getNavbarLinks(page) {
  return await page.evaluate(() => {
    const navLinks = document.querySelectorAll(".navbar .navbar-nav a");
    const hrefs = [...new Set([...navLinks].map((link) => link.href.trim()))];
    return hrefs.filter((href) => href && !href.startsWith("#")); // Remove empty & anchor links
  });
}

module.exports = getNavbarLinks;
