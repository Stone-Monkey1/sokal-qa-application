const selectorParser = require("postcss-selector-parser");

function parseSelectorList(selectorStr) {
  return selectorStr.split(",").map((s) => s.trim());
}

async function cssAudit(page) {
  const url = page.url();

  try {
    console.log(`🔍 Auditing CSS on ${url}`);

    const cssData = await page.evaluate(() => {
      const collected = {
        domClasses: new Set(),
        blockRules: {},
      };

      document.querySelectorAll("*").forEach((el) => {
        el.classList.forEach((cls) => collected.domClasses.add(cls));
      });

      for (const styleTag of Array.from(document.querySelectorAll("style"))) {
        const cssText = styleTag.innerText || styleTag.textContent || "";
        if (!cssText.includes("BEGIN")) continue;

        const lines = cssText.split("\n");
        const rulesByBlock = {};
        let currentBlock = null;

        let insideMedia = false;
        let mediaLines = [];
        let mediaHeader = "";
        let braceDepth = 0;

        let buffer = [];
        let insideRule = false;
        let currentSelector = "";
        let currentBlockName = null;

        for (const line of lines) {
          const trimmed = line.trim();

          const beginMatch = trimmed.match(/\/\*\s*(\w+)\s+BEGIN\s*\*\/?/i);
          const endMatch = trimmed.match(/\/\*\s*(\w+)\s+END\s*\*\/?/i);

          if (beginMatch) {
            currentBlockName = beginMatch[1].toUpperCase();
            continue;
          } else if (endMatch) {
            currentBlockName = null;
            continue;
          }

          if (!currentBlockName) continue;

          // Handle @media as you do now
          if (trimmed.startsWith("@media")) {
            insideMedia = true;
            mediaHeader = trimmed;
            mediaLines = [trimmed];
            braceDepth =
              (trimmed.match(/{/g) || []).length -
              (trimmed.match(/}/g) || []).length;
            continue;
          }

          if (insideMedia) {
            mediaLines.push(trimmed);
            braceDepth += (trimmed.match(/{/g) || []).length;
            braceDepth -= (trimmed.match(/}/g) || []).length;

            if (braceDepth <= 0) {
              insideMedia = false;
              const fullMediaRule = mediaLines.join("\n");
              const innerContent = fullMediaRule
                .replace(/^@media[^{]+{/, "")
                .replace(/}$/, "");

              const innerRules = innerContent
                .split("}")
                .map((chunk) => chunk.trim())
                .filter(Boolean);

              innerRules.forEach((ruleChunk) => {
                const [selectorsPart, stylePart] = ruleChunk.split("{");
                if (!selectorsPart || !stylePart) return;

                const selector = selectorsPart.trim();
                const styleBlock = stylePart.trim();
                const selectors = selector.split(",").map((s) => s.trim());

                const style = styleBlock
                  .split(";")
                  .filter(Boolean)
                  .map((s) => {
                    const [property, value] = s.split(":");
                    return {
                      property: property?.trim(),
                      value: value?.trim(),
                    };
                  });

                if (!rulesByBlock[currentBlockName])
                  rulesByBlock[currentBlockName] = [];
                rulesByBlock[currentBlockName].push({
                  selector,
                  selectors,
                  style,
                  fullRule: fullMediaRule,
                });
              });

              mediaLines = [];
            }

            continue;
          }

          // For normal rules (multiline-safe)
          if (trimmed.endsWith("{") || insideRule) {
            buffer.push(trimmed);

            if (trimmed.includes("{")) insideRule = true;
            if (trimmed.includes("}")) {
              insideRule = false;
              const ruleText = buffer.join("\n");
              buffer = [];

              const selectorMatch = ruleText.match(/^([^{]+)\s*\{/);
              const styleMatch = ruleText.match(/\{([^}]+)\}/);

              if (selectorMatch && styleMatch) {
                const selector = selectorMatch[1].trim();
                const styleBlock = styleMatch[1].trim();
                const selectors = selector.split(",").map((s) => s.trim());

                const style = styleBlock
                  .split(";")
                  .filter(Boolean)
                  .map((s) => {
                    const [property, value] = s.split(":");
                    return {
                      property: property?.trim(),
                      value: value?.trim(),
                    };
                  });

                if (!rulesByBlock[currentBlockName])
                  rulesByBlock[currentBlockName] = [];
                rulesByBlock[currentBlockName].push({
                  selector,
                  selectors,
                  style,
                  fullRule: ruleText,
                });
              }
            }
          }
        }

        for (const [block, rules] of Object.entries(rulesByBlock)) {
          if (!collected.blockRules[block]) collected.blockRules[block] = [];
          collected.blockRules[block].push(...rules);
        }
      }

      return {
        domClasses: Array.from(collected.domClasses),
        blockRules: collected.blockRules,
      };
    });

    const unusedCSSByBlock = {};

    for (const [block, rules] of Object.entries(cssData.blockRules)) {
      for (const rule of rules) {
        const unusedSelectors = [];

        for (const selector of rule.selectors) {
          try {
            console.log(`Evaluating selector: "${selector}"`);
            const matches = await page.$$(selector);
            if (!matches || matches.length === 0) {
              unusedSelectors.push(selector);
            }
          } catch {
            // Ignore invalid selectors (e.g., :hover)
          }
        }

        if (unusedSelectors.length) {
          if (!unusedCSSByBlock[block]) unusedCSSByBlock[block] = [];
          unusedCSSByBlock[block].push({
            fullRule: rule.fullRule,
            unusedSelectors,
          });
        }
      }
    }

    return Object.keys(unusedCSSByBlock).length === 0
      ? null
      : {
          [url]: {
            cssAudit: {
              unusedCSSByBlock: unusedCSSByBlock,
            },
          },
        };
  } catch (err) {
    return { [url]: { error: `Error analyzing CSS: ${err.message}` } };
  }
}

module.exports = cssAudit;
