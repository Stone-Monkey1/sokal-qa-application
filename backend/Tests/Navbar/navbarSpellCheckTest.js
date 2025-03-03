const { execSync } = require("child_process");
const fs = require("fs");

async function navbarSpellCheckTest(page) {
  const url = page.url();

  try {
    await page.waitForLoadState("domcontentloaded");

    console.log(`Checking spelling on ${url}`);

    // Extract all text content from the page
    const textContent = await page.evaluate(() => document.body.innerText);

    // Write extracted text to temp.txt
    fs.writeFileSync("temp.txt", textContent);
    console.log(`Saved text from ${url} to temp.txt`);

    // Run aspell spell checker on temp.txt
    let spellCheckReport;
    try {
      console.log(`Running aspell on temp.txt for ${url}...`);

      // Execute aspell and capture output
      spellCheckReport = execSync("aspell list < temp.txt", {
        encoding: "utf-8",
      }).trim();

      if (spellCheckReport) {
        console.log(`Spelling errors found on ${url}:\n`, spellCheckReport);
      } else {
        console.log(`No spelling errors found on ${url}.`);
        spellCheckReport = ""; // Ensure we return an empty string instead of a message
      }
    } catch (error) {
      spellCheckReport = error.stdout
        ? error.stdout.toString().trim()
        : "Unknown spelling check error";
      console.error(`Error running aspell on ${url}:`, spellCheckReport);
    }

    // Clear temp.txt after processing
    fs.writeFileSync("temp.txt", "");

    return {
      [url]: {
        navbarSpellCheckTest: {
          spellCheck: spellCheckReport
            ? spellCheckReport.split("\n").filter((word) => word.trim() !== "")
            : [],
        },
      },
    };
  } catch (error) {
    console.error(`Error loading ${url}:`, error.message);
    return { [url]: { error: `Error loading page: ${error.message}` } };
  }
}

module.exports = navbarSpellCheckTest;
