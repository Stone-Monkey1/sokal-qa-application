async function runAdditionalChecks(
  page,
  selectedTests,
  navbarLinks,
  executedTests
) {
  const results = {};

  if (!Array.isArray(navbarLinks)) {
    console.error("Error: navbarLinks is not an array in runAdditionalChecks");
    return { error: "Invalid navbarLinks data" };
  }

  for (const link of navbarLinks) {
    for (const testName of selectedTests) {
      const testKey = `${testName}-${link}`;

      if (executedTests.has(testKey)) {
        console.log(`Skipping ${testName} on ${link} (already executed).`);
        continue;
      }

      executedTests.add(testKey);
      console.log(`Running ${testName} on ${link}`);

      try {
        const testModule = require(`../Tests/${testName}`);
        const testResult = await testModule(
          page,
          selectedTests,
          navbarLinks,
          executedTests
        );

        if (!results[link]) {
          results[link] = {};
        }

        if (testResult && testResult[link]) {
          results[link] = { ...results[link], ...testResult[link] };
        } else {
          console.error(`Test ${testName} did not return results for ${link}`);
        }
      } catch (error) {
        console.error(`Error running ${testName} on ${link}:`, error.message);
        results[link] = {
          ...results[link],
          [testName]: { error: `Error running test: ${error.message}` },
        };
      }
    }
  }

  return results;
}

module.exports = runAdditionalChecks;
