<template>
  <div class="results">
    <h2>Results:</h2>
    <div class="results-buttons flex-row">
      <button @click="copyToClipboard" class="copy-btn qa-btn flex-column">
        Copy JSON
      </button>
      <button
        @click="toggleAllAccordions"
        class="accordion-open-button qa-btn"
      >
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
                <li class="flex-li" v-for="(value, key) in testData" :key="key">
                  <div class="flex-li--key">
                    <strong
                      :class="getClassForKey(key)"
                      v-if="key === 'h1TextContentList'"
                      >H1 Tags:</strong
                    >
                    <strong :class="getClassForKey(key)" v-else>{{
                      key
                    }}</strong>
                  </div>
                  <div class="flex-li--value">
                    <ul v-if="Array.isArray(value)">
                      <li v-for="(error, index) in value" :key="index">
                        {{ error }}
                      </li>
                    </ul>
                    <span v-else>{{ value }}</span>
                  </div>
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
      return Object.values(tests).some((test) => {
        if (typeof test === "object" && test !== null) {
          return Object.values(test).some((value) => {
            if (typeof value === "string") {
              return !value.toLowerCase().includes("no issues found");
            }
            if (Array.isArray(value)) {
              return value.length > 0; // Check if array contains any errors
            }
            return false;
          });
        }
        return false;
      });
    },
    getClassForKey(key) {
      if (key.toLowerCase().includes("results")) return "success-msg";
      if (key.toLowerCase().includes("warning")) return "warning-msg";
      if (key.toLowerCase().includes("h1textcontentlist"))
        return "warning-instances-msg";
      if (key.toLowerCase().includes("resolution")) return "resolution-msg";
      if (key.toLowerCase().includes("error")) return "error-msg";
      return "";
    },
  },
  mounted() {
    // Automatically open URLs with no issues
    this.openAccordions = Object.entries(this.results)
      .filter(([, tests]) => !this.hasIssues(tests))
      .map(([url]) => url); 
  },
};
</script>

<style>
.results {
  padding: 20px;
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
