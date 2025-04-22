module.exports.normalizeUrlKey = function (rawUrl) {
  try {
    const url = new URL(rawUrl);
    url.hostname = url.hostname.replace(/^www\./, "");
    url.hash = "";
    return url.toString();
  } catch {
    return rawUrl;
  }
};

module.exports.normalizeTestResultKeys = function (resultObj, normalizeUrlKey) {
  const normalized = {};
  for (const rawKey of Object.keys(resultObj)) {
    const normalizedKey = normalizeUrlKey(rawKey);
    normalized[normalizedKey] = resultObj[rawKey];
  }
  return normalized;
};
