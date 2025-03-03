<template>
  <div class="results">
    <h2>Results:</h2>
    <div class="results-buttons flex-row">
      <button @click="copyToClipboard" class="copy-btn results-btn flex-column">Copy JSON</button>
      <button @click="toggleAllAccordions" class="accordion-open-button results-btn">
        {{ allAccordionsOpen ? "Close All" : "Open All" }}
      </button>
    </div>

    <div v-if="Object.keys(results).length">
      <div v-for="(tests, url) in results" :key="url" class="accordion">
        <!-- Check if any tests contain errors -->
        <button
          v-if="hasIssues(tests)"
          @click="toggleAccordion(url)"
          class="accordion-header"
        >
          <a :href="url" target="_blank">{{ url }}</a>
          <span class="arrow" :class="{ open: openAccordions.includes(url) }"
            >▼</span
          >
        </button>

        <!-- If no issues found, default to open, no arrow -->
        <div v-else class="accordion-header no-toggle">
          <a :href="url" target="_blank">{{ url }}</a>
        </div>

        <!-- Accordion Content -->
        <div
          v-if="openAccordions.includes(url) || !hasIssues(tests)"
          class="accordion-content"
        >
          <div v-if="Object.keys(tests).length">
            <div
              v-for="(testData, testName) in tests"
              :key="testName"
              class="test-result"
            >
              <h4>{{ testName }}</h4>
              <ul v-if="typeof testData === 'object' && testData !== null">
                <li v-for="(value, key) in testData" :key="key">
                  <strong>{{ key }}:</strong> {{ value }}
                </li>
              </ul>
              <p v-else>{{ testData }}</p>
            </div>
          </div>
          <p v-else class="no-issues">No issues found.</p>
        </div>
      </div>
    </div>
    <p v-else>No results to display.</p>
  </div>
</template>

<script>
export default {
  props: ["results"],
  data() {
    return {
      openAccordions: [],
    };
  },
  computed: {
    rawJson() {
      return JSON.stringify(this.results, null, 2);
    },
    allAccordionsOpen() {
      return this.openAccordions.length === Object.keys(this.results).length;
    },
  },
  methods: {
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.rawJson);
        alert("Results copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
        alert("Failed to copy results.");
      }
    },
    toggleAllAccordions() {
      if (this.openAccordions.length === Object.keys(this.results).length) {
        // If all are open, close them
        this.openAccordions = [];
      } else {
        // Otherwise, open all
        this.openAccordions = Object.keys(this.results);
      }
    },
    toggleAccordion(url) {
      if (this.openAccordions.includes(url)) {
        this.openAccordions = this.openAccordions.filter(
          (item) => item !== url
        );
      } else {
        this.openAccordions.push(url);
      }
    },
    hasIssues(tests) {
      // Check if any test contains an error or message other than "No issues found"
      return Object.values(tests).some((test) => {
        if (typeof test === "object" && test !== null) {
          return Object.values(test).some(
            (value) =>
              typeof value === "string" &&
              !value.toLowerCase().includes("no issues found")
          );
        }
        return false;
      });
    },
  },
  mounted() {
    // Automatically open URLs with no issues
    this.openAccordions = Object.entries(this.results)
      .filter(([, tests]) => !this.hasIssues(tests)) // Ignore first element
      .map(([url]) => url); // Keep the URL for the accordion list
  },
};
</script>

<style>
.results {
  padding: 20px;
}

.results-btn {
  background: #007bff;
  color: white;
  border: none;
  width: 150px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  margin: 0px 5px 15px 5px;
}

.results-btn:hover {
  background: #0056b3;
}

/* Accordion Styling */
.accordion {
  margin-bottom: 10px;
}

.accordion-header {
  background: #f4f4f4;
  padding: 10px;
  width: 100%;
  text-align: left;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.accordion-header a {
  text-decoration: none;
  color: #007bff;
}

.accordion-header a:hover {
  text-decoration: underline;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

/* Accordion Content */
.accordion-content {
  background: #ffffff;
  border-left: 4px solid #007bff;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
}

/* Test Results */
.test-result {
  padding-left: 10px;
  border-left: 3px solid #007bff;
  margin-top: 10px;
}

.test-result h4 {
  color: #007bff;
}

.test-result ul {
  list-style-type: none;
  padding: 0;
}

.test-result li {
  background: #f9f9f9;
  margin: 5px 0;
  padding: 5px;
  border-radius: 5px;
}

/* No Issues Found Styling */
.no-issues {
  font-weight: bold;
  color: #28a745;
}

/* Make "no issues" accordion headers not clickable */
.no-toggle {
  background: #e8f5e9;
  padding: 10px;
  text-align: left;
  border-radius: 5px;
  font-weight: bold;
  cursor: default;
}
</style>
