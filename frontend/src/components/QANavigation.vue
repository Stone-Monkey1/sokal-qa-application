<template>
  <div>
    <div class="qa-form-toggle-buttons">
      <button
        class="qa-btn"
        :class="{ active: currentView === 'website' }"
        @click="currentView = 'website'"
      >
        Website QA
      </button>
      <button
        class="qa-btn"
        :class="{ active: currentView === 'page' }"
        @click="currentView = 'page'"
      >
        Single Page QA
      </button>
      <a
        target="_blank"
        href="https://templates.sokalsites.com/sokal-utility-styles"
      >
        <button class="qa-btn">Sokal CSS</button>
      </a>
      <button
        class="qa-btn"
        :class="{ active: currentView === 'wordSearch' }"
        @click="currentView = 'wordSearch'"
      >
        Word Search
      </button>
    </div>

    <QAFormWebsite
      v-if="currentView === 'website'"
      @run-tests="$emit('run-tests', $event)"
      @tests-started="$emit('tests-started')"
      @tests-completed="$emit('tests-completed')"
    />
    <QAFormPage
      v-else-if="currentView === 'page'"
      @run-tests="$emit('run-tests', $event)"
      @tests-started="$emit('tests-started')"
      @tests-completed="$emit('tests-completed')"
    />
    <SokalCSSClasses v-else-if="currentView === 'css'" />
    <WebsiteKeywordSearch v-else-if="currentView === 'wordSearch'"
    @tests-started="$emit('tests-started')"
    @tests-completed="$emit('tests-completed', $event)" />
  </div>
</template>

<script>
import QAFormWebsite from "./QAForm/QAFormWebsite.vue";
import QAFormPage from "./QAForm/QAFormPage.vue";
import SokalCSSClasses from "./pages/SokalCSSClasses.vue";
import WebsiteKeywordSearch from "./pages/WebsiteKeywordSearch.vue";

export default {
  components: {
    QAFormWebsite,
    QAFormPage,
    SokalCSSClasses,
    WebsiteKeywordSearch,
  },
  data() {
    return {
      currentView: "website",
    };
  },
};
</script>

<style scoped>
.qa-form-toggle-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
#app .qa-form-toggle-buttons a {
  font-size: 1rem;
}
.qa-btn {
  width: 200px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  background-color: #bab9b9;
  border: 1px solid #ccc;
  transition: background-color 0.2s;
}
.qa-btn.active {
  background-color: #7575f8;
  font-weight: bold;
}
</style>
