<template>
  <div id="QA_TOOL">
    <QAHeader @toggle-todo="toggleToDo" />
    <transition name="slide">
      <div v-if="showToDo" class="to-do-panel" @click.stop>
        <button class="close-btn" @click="toggleToDo">✖ Close</button>
        <QAToDo />
      </div>
    </transition>
    <div class="padding-2-percent">
      <QAFormWrapper
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
import QAToDo from "./components/QAToDo.vue";
import QALoading from "./components/QALoading.vue";
import QAFormWrapper from "./components/QAForm/QAFormWrapper.vue";

export default {
  components: {
    QAHeader,
    QAResults,
    QAToDo,
    QALoading,
    QAFormWrapper,
  },
  data() {
    return {
      results: null,
      showToDo: false,
      loading: false,
    };
  },
  methods: {
    async runTests(payload) {
      console.log("Full test payload received:", payload);

      const { url, selectedTests, mode } = payload;

      const API_URL =
        process.env.NODE_ENV === "production"
          ? "http://127.0.0.1:3000/run-tests"
          : "http://localhost:3000/run-tests";

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, selectedTests, mode }),
        });

        this.results = await response.json();
      } catch (error) {
        console.error("Error running tests:", error);
        this.results = { error: "Failed to fetch results" };
      } finally {
        this.loading = false;
      }
    },

    toggleToDo(event) {
      if (event) {
        event.stopPropagation(); // Prevents accidental double events
      }
      // if (this.toggleLock) return;
      console.log("To-Do Panel Visibility PRE:", this.showToDo);
      this.showToDo = !this.showToDo;
      console.log("To-Do Panel Visibility POST:", this.showToDo);
    },
  },
};
</script>
<style>
/* To Do Sliding Panel to hide To Do Tasks */

.to-do-panel {
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  transform: translateX(0%);
  transition: transform 0.3s ease-in-out;
  padding: 20px;
  overflow-y: auto;
  z-index: 1000; /* Ensures it stays above other elements */
}

/* Vue transition */
.slide-enter-active,
.slide-leave-active {
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
