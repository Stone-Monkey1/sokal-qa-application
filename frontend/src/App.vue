<template>
  <div id="QA_TOOL">
    <QAHeader @toggle-todo="toggleToDo" />
    <transition name="slide">
      <div v-if="showToDo" class="to-do-panel" @click.stop>
        <button class="close-btn" @click="toggleToDo">✖ Close</button>
        <QAToDo/>
      </div>
    </transition>
    <div class="container">
      <QAForm @run-tests="runTests" />
      <QAResults v-if="results" :results="results"/>
    </div>
    <div class="git-push-test-section">
      <p>Testing testing testing</p>
    </div>
  </div>
</template>

<script>
import QAForm from "./components/QAForm.vue";
import QAHeader from "./components/QAHeader.vue";
import QAResults from "./components/QAResults.vue";
import QAToDo from "./components/QAToDo.vue";

export default {
  components: {
    QAForm,
    QAHeader,
    QAResults,
    QAToDo
  },
  data() {
    return {
      results: null,
      showToDo: false,
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
    toggleToDo(event) {
      if (event) {
        event.stopPropagation(); // Prevents accidental double events
      }
      // if (this.toggleLock) return;
      console.log("To-Do Panel Visibility PRE:", this.showToDo);
      this.showToDo = !this.showToDo;
      console.log("To-Do Panel Visibility POST:", this.showToDo);
      // this.toggleLock = true;
      // setTimeout(() => { this.toggleLock = false; }, 500)
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


 /* To Do Sliding Panel to hide To Do Tasks */
/* .to-do-panel {
  background-color: white;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  transform: translateX(0%);
  transition: transform 0.3s ease-in-out;
} */

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

/* .slide-enter {
  transition: transform .3s ease-in-out;
} */

/* .slide-enter-to {
  transform: translateX(0%);
} */

/* .slide-leave-to {
  transform: translateX(100%);
} */

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
