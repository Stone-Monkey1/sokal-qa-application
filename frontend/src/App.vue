<template>
  <div>
    <QAToDo/>
    <QAForm @run-tests="runTests" />
    <QAResults v-if="results" :results="results"/>
    <div class="git-push-test-section">
      <p>Testing testing testing</p>
    </div>
  </div>
</template>

<script>
import QAForm from "./components/QAForm.vue";
import QAResults from "./components/QAResults.vue";
import QAToDo from "./components/QAToDo.vue";

export default {
  components: {
    QAForm,
    QAResults,
    QAToDo
  },
  data() {
    return {
      results: null,
    };
  },
  methods: {
    async runTests({ url, selectedTests }) {
      try {
        const response = await fetch("http://localhost:3000/run-tests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, selectedTests }),
        });

        this.results = await response.json();
      } catch (error) {
        console.error("Error running tests:", error);
        this.results = { error: "Failed to fetch results" };
      }
    },
  },
};
</script>
<style>
 .git-push-test-section {
  background-color: #2b2b2b;
  color: #eeeeee;
  padding: 24px;
  font-size: 2em;
  font-weight: light;
  width: 100%;
  border: 1px solid #000000;
 }
</style>
