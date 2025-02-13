const fs = require("fs");
const path = require("path");

// Store completed tests in a Set
const completedTests = new Set();

async function runAdditionalChecks(page, selectedTests) {
  const results = {};

  // Ensure selectedTests is an array (to prevent errors)
  if (!Array.isArray(selectedTests) || selectedTests.length === 0) {
    return results; // Return empty object if no additional tests are selected
  }

  // Dynamically load all available tests from the `Tests` folder
  const testsDirectory = require("path").join(__dirname, "../Tests");
  const availableTests = {};

  fs.readdirSync(testsDirectory).forEach((file) => {
    if (file.endsWith(".js")) {
      const testName = file.replace(".js", ""); // Remove .js from filename
      availableTests[testName] = require(require("path").join(
        testsDirectory,
        file
      )); // Import test
    }
  });

  for (const testName of selectedTests) {
    // Skip tests that have already run on all links
    if (!completedTests.has(testName) && availableTests[testName]) {
      results[testName] = await availableTests[testName](page);
      completedTests.add(testName); // Mark test as completed
    }
  }

  return results;
}

module.exports = runAdditionalChecks;
