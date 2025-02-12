<template>
  <div>
    <QAToDo/>
    <QAForm @run-tests="runTests" />
    <QAResults v-if="results" :results="results" />
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
