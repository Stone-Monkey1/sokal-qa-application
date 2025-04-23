<template>
  <div class="sokal-css-wrapper">
    <h1>Sokal Utility CSS</h1>
    <div id="css-guide">
      <div v-for="(section, index) in cssSections" :key="index">
        <h2>{{ section.title }}</h2>
        <div v-for="rule in section.rules" :key="rule.selector">
          <details class="sokal-rule">
            <summary>{{ rule.selector }}</summary>
            <pre>{{ rule.css }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SokalCSSClasses",
  data() {
    return {
      cssSections: [],
    };
  },
  mounted() {
    const sectionsMap = {};

    for (const sheet of document.styleSheets) {
      try {
        if (!sheet.href || sheet.href.includes("SokalCSSClasses.css")) {
          const rules = sheet.cssRules || [];

          for (const rule of rules) {
            if (rule.selectorText?.startsWith(".sokal")) {
              const title = this.getSectionTitle(rule.selectorText);
              const cssText = this.formatCSS(rule);
              if (!sectionsMap[title]) {
                sectionsMap[title] = [];
              }
              sectionsMap[title].push({
                selector: rule.selectorText,
                css: cssText,
              });
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheets will throw errors, skip them
        continue;
      }
    }

    this.cssSections = Object.entries(sectionsMap).map(([title, rules]) => ({
      title,
      rules,
    }));
  },
  methods: {
    formatCSS(rule) {
      const text = rule.cssText || "";
      const body = text
        .replace(rule.selectorText, "")
        .trim()
        .replace(/^{|}$/g, "");
      const lines = body
        .split(";")
        .map((line) => line.trim())
        .filter(Boolean);
      return `${rule.selectorText} {\n  ${lines.join(";\n  ")};\n}`;
    },
    getSectionTitle(selector) {
      const map = {
        ".sokal-space-y-05": "Spacers",
        ".sokal-w-auto": "Width & Height",
        ".sokal-m-0": "Margin",
        ".sokal-p-0": "Padding",
        ".sokal-align-middle": "Layout",
        ".sokal-relative": "Position",
        ".sokal-items-start": "Flex",
        ".sokal-bg-primary": "Backgrounds & Colors",
        ".sokal-bg-layer": "Background Layers",
        ".sokal-box-shadow": "Shadows",
        ".sokal-icon": "Icons",
        ".sokal-media-container": "Images",
        ".sokal-card": "Cards",
        ".sokal-select-container": "Select Elements",
      };
      return map[selector] || "Miscellaneous";
    },
  },
};
</script>

<style scoped>
.sokal-css-wrapper {
  padding: 1rem;
}
details summary {
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
pre {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
  white-space: pre-wrap;
}
</style>
