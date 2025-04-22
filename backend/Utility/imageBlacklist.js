// Utility/imageBlacklist.js

// List of substrings commonly found in tracking pixels or unwanted images
const imageBlacklistPatterns = [
  "insight.adsrvr.org",
  "idpix.",
  "left-arrow-white-cf",
  "sokal-logo-white",
  "match.adsrvr",
  "bat.bing",
  "beacon",
  "stats.g.doubleclick.net",
  "facebook.com/tr",
  "google-analytics.com",
  "adservice",
  "quantserve",
  "scorecardresearch",
  "sync.gosokal",
  "fonts.gstatic",
  "s3.amazonaws"
];

function isBlacklistedImage(src) {
  if (!src) return false;
  return imageBlacklistPatterns.some((pattern) =>
    src.toLowerCase().includes(pattern)
  );
}

module.exports = { isBlacklistedImage };
