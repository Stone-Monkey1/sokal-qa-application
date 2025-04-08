const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

async function navbarSpellCheckTest(page) {
  const url = page.url();

  try {
    await page.waitForLoadState("domcontentloaded");

    console.log(`Checking spelling on ${url}`);

    const textContent = await page.evaluate(() => document.body.innerText);

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, "temp.txt");

    fs.writeFileSync(tempFilePath, textContent);
    console.log(`Saved text from ${url} to temp.txt at ${tempFilePath}`);

    let spellCheckReport;
    try {
      console.log(`Running aspell on temp.txt for ${url}...`);

      const aspellExecutable = path.join(
        __dirname,
        "..",
        "..",
        "aspell-bin",
        "aspell"
      );
      if (!fs.existsSync(aspellExecutable)) {
        throw new Error(`Aspell binary not found at ${aspellExecutable}`);
      }
      

      spellCheckReport = execSync(
        `"${aspellExecutable}" list < "${tempFilePath}"`,
        {
          encoding: "utf-8",
        }
      );

      if (spellCheckReport) {
        console.log(`Spelling errors found on ${url}:\n`, spellCheckReport);
      } else {
        console.log(`No spelling errors found on ${url}.`);
        spellCheckReport = "";
      }
    } catch (error) {
      spellCheckReport = error.stdout
        ? error.stdout.toString().trim()
        : "Unknown spelling check error";
      console.error(`Error running aspell on ${url}:`, spellCheckReport);
    }

    fs.unlinkSync(tempFilePath);

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
