<template>
  <div class="css-audit-container qa-form">
    <h2>CSS Audit Single Page</h2>
    <div class="separator-div-small"></div>

    <label for="url">Page URL:</label>
    <input
      class="website-url"
      type="text"
      v-model="url"
      placeholder="https://gosokal.com"
    />

    <p>Instructions:</p>
    <p>Ensure that your style element is wrapped in a comment like "FinanceApplication BEGIN" and has "FinanceApplication END" the "BEGIN" and "END" act as markers.</p>
    <button class="qa-btn" @click="runCSSAudit">Run Audit</button>

    <div
      v-if="
        Object.keys(flatResults.unused).length ||
        Object.keys(flatResults.overwritten).length
      "
    >
      <h3>Audit Results (Grouped by CSS Block)</h3>

      <div v-if="Object.keys(flatResults.unused).length">
        <h4>🟠 Unused CSS</h4>
        <div v-for="(rules, block) in flatResults.unused" :key="block">
          <strong>{{ block }}</strong>
          <ul>
            <li
              v-for="(rule, index) in rules"
              :key="index"
              class="unused-rule-block"
            >
              <pre class="css-block">
            {{ rule.fullRule }}
          </pre
              >
              <div class="highlight-note">
                Unused selectors:
                <ul>
                  <li
                    v-for="selector in rule.unusedSelectors"
                    :key="selector"
                    class="unused-selector"
                  >
                    {{ selector }}
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="Object.keys(flatResults.overwritten).length">
        <h4>🟡 Overwritten CSS</h4>
        <div v-for="(rules, block) in flatResults.overwritten" :key="block">
          <strong>{{ block }}</strong>
          <ul>
            <li
              v-for="(rule, idx) in rules"
              :key="idx"
              style="color: goldenrod"
            >
              {{ rule.selector }} → {{ rule.property }}: "{{ rule.declared }}"
              (computed: "{{ rule.computed }}")
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuditCSS",
  data() {
    return {
      url: "",
      loading: false,
      error: null,
      results: null,
      flatResults: {
        unused: {},
        overwritten: {},
      },
    };
  },
  methods: {
    async runCSSAudit() {
      if (!this.url) return (this.error = "Please enter a URL.");
      this.$emit("tests-started");
      this.loading = true;
      this.error = null;
      this.results = null;
      this.flatResults = { unused: {}, overwritten: {} };

      try {
        const response = await fetch("http://localhost:3000/css-audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: this.url,
            selectedTests: ["cssAudit"],
            mode: "single",
          }),
        });

        const data = await response.json();
        this.results = data;
        this.flattenCSSAuditResults(data);
      } catch (err) {
        this.error = err.message || "Something went wrong.";
        ``;
      } finally {
        this.$emit("tests-completed");
      }
    },

    flattenCSSAuditResults(data) {
      const unused = {};
      const overwritten = {};

      for (const url in data) {
        const cssAudit = data[url]?.cssAudit;
        if (!cssAudit) continue;

        if (cssAudit.unusedCSSByBlock) {
          for (const block in cssAudit.unusedCSSByBlock) {
            if (!unused[block]) unused[block] = [];
            cssAudit.unusedCSSByBlock[block].forEach((rule) => {
              unused[block].push(rule);
            });
          }
        }

        // Still handle overwritten results if they exist
        for (const block in cssAudit.overwrittenCSSByBlock || {}) {
          if (!overwritten[block]) overwritten[block] = [];
          overwritten[block].push(...cssAudit.overwrittenCSSByBlock[block]);
        }
      }

      this.flatResults = {
        unused,
        overwritten,
      };
    },
  },
};
</script>

<style scoped>
.audit-result {
  margin-top: 1em;
  border-top: 1px solid #ccc;
  padding-top: 0.5em;
}
.unused-selector {
  color: orange;
  font-weight: bold;
}

.css-block {
  background-color: #f8f8f8;
  padding: 10px;
  font-family: monospace;
  white-space: pre-wrap;
  border-left: 4px solid #ccc;
}

.highlight-note {
  margin-top: 5px;
  font-size: 0.9em;
  color: #555;
}
</style>
