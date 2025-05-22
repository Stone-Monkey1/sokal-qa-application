<template>
  <div id="QA_TOOL">
    <QAHeader />
    <div class="padding-2-percent">
      <QANavigation
        @run-tests="runTests"
        @tests-started="loading = true"
        @tests-completed="loading = false"
      />
      <QALoading :visible="loading" />
      <QAResults v-if="results" :results="results" />
    </div>
  </div>
</template>

<script>
import QAHeader from "./components/QAHeader.vue";
import QAResults from "./components/QAResults.vue";
import QALoading from "./components/QALoading.vue";
import QANavigation from "./components/QANavigation.vue";

export default {
  components: {
    QAHeader,
    QAResults,
    QALoading,
    QANavigation,
  },
  data() {
    return {
      results: null,
      loading: false,
    };
  },
  methods: {
    async runTests(payload) {
      console.log("Full test payload received:", payload);

      const isKeywordSearch = !!payload.keywords;
      const isCssAudit =
        Array.isArray(payload.selectedTests) &&
        payload.selectedTests.length === 1 &&
        payload.selectedTests[0] === "cssAudit";

      let API_URL;

      if (isKeywordSearch) {
        API_URL = "http://localhost:3000/website-keyword-search";
      } else if (isCssAudit && payload.mode === "single") {
        API_URL = "http://localhost:3000/css-audit";
        // Optional: Remove `selectedTests` since /css-audit doesn't need it
        delete payload.selectedTests;
      } else {
        API_URL = "http://localhost:3000/run-tests";
      }

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        this.results = data;
      } catch (error) {
        console.error("❌ Error running tests:", error);
        this.results = { error: "Failed to fetch results" };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style></style>
