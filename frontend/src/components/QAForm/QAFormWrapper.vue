<template>
  <div>
    <div class="qa-form-toggle-buttons">
      <button
        class="qa-btn"
        :class="{ active: currentForm === 'website' }"
        @click="currentForm = 'website'"
      >
        Website QA
      </button>
      <button
        class="qa-btn"
        :class="{ active: currentForm === 'page' }"
        @click="currentForm = 'page'"
      >
        Single Page QA
      </button>
    </div>

    <QAFormWebsite
      v-if="currentForm === 'website'"
      @run-tests="handleRunTests"
      @tests-started="handleTestsStarted"
    />

    <QAFormPage
      v-else
      @run-tests="handleRunTests"
      @tests-started="handleTestsStarted"
    />
  </div>
</template>

<script>
import QAFormWebsite from "./QAFormWebsite.vue";
import QAFormPage from "./QAFormPage.vue";

export default {
  components: {
    QAFormWebsite,
    QAFormPage,
  },
  data() {
    return {
      currentForm: "website", // or "page"
    };
  },
  methods: {
    handleRunTests(payload) {
      this.$emit("run-tests", payload);
    },
    handleTestsStarted() {
      this.$emit("tests-started");
    },
  },
};
</script>

<style>
.qa-form-toggle-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.qa-form-toggle-buttons .qa-btn {
  width: 200px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  background-color: #eee;
  border: 1px solid #ccc;
  transition: background-color 0.2s;
}
.qa-form-toggle-buttons .qa-btn.active {
  background-color: #7575f8;
  font-weight: bold;
}
.header img {
  height: calc(1.375rem + 1.5vw);
}
.qa-form label[for="url"] {
  margin-right: 1rem;
}
.qa-form input.website-url {
  width: 50vw;
}
.qa-form .test-checklist label:not(:last-of-type) {
  margin-bottom: 0.7rem;
}
.qa-form .test-accordion {
  display: flex;
  gap: 1rem;
}
.qa-form .test-accordion .flex-column {
  flex: 1;
}
.qa-form .accordion-body label {
  width: 100%;
}
</style>
