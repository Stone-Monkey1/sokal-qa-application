<template>
  <div>
    <div class="qa-form-toggle-buttons">
      <button
        v-for="parent in parentViews"
        :key="parent.id"
        class="qa-btn"
        :class="{ active: currentParent === parent.id }"
        @click="setParent(parent.id)"
      >
        {{ parent.label }}
      </button>
      <a
        class="qa-btn"
        href="https://templates.sokalsites.com/sokal-utility-styles"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sokal CSS
      </a>
    </div>

    <div v-if="currentParent !== 'toolsDirectory'">
      <button
        v-for="mode in subViews"
        :key="mode.id"
        class="qa-btn"
        :class="{ active: currentView === `${currentParent}-${mode.id}` }"
        @click="currentView = `${currentParent}-${mode.id}`"
      >
        {{ mode.label }}
      </button>
    </div>

    <component
      :is="activeComponent"
      v-if="activeComponent"
      @run-tests="$emit('run-tests', $event)"
      @tests-started="$emit('tests-started')"
      @tests-completed="$emit('tests-completed')"
    />
  </div>
</template>

<script>
import QAFormWebsite from "./QAForm/QAFormWebsite.vue";
import QAFormPage from "./QAForm/QAFormPage.vue";
import KeywordSearchWebsite from "./WordSearch/KeywordSearchWebsite.vue";
import KeywordSearchPage from "./WordSearch/KeywordSearchPage.vue"
import AuditCSSWebsite from "./CSSAudit/AuditCSSWebsite.vue";
import AuditCSSPage from "./CSSAudit/AuditCSSPage.vue";
import ToolsDirectoryWebsite from "./ToolsDirectory/ToolsDirectoryWebsite.vue";


export default {
  data() {
    return {
      currentParent: "qa", // default selected parent
      currentView: "qa-website",
      parentViews: [
        { id: "qa", label: "QA" },
        { id: "wordSearch", label: "Word Search" },
        { id: "auditCSS", label: "CSS Audit" },
        { id: "toolsDirectory", label: "Tools Directory" },
      ],
      subViews: [
        { id: "website", label: "Website" },
        { id: "page", label: "Single Page" },
      ],
      componentMap: {
        "qa-website": QAFormWebsite,
        "qa-page": QAFormPage,
        "wordSearch-website": KeywordSearchWebsite,
        "wordSearch-page": KeywordSearchPage,
        "auditCSS-website": AuditCSSWebsite,
        "auditCSS-page": AuditCSSPage,
        "toolsDirectory-website": ToolsDirectoryWebsite,
      },
    };
  },
  computed: {
    activeComponent() {
      return this.componentMap[this.currentView] || null;
    },
  },
  methods: {
    setParent(parentId) {
      this.currentParent = parentId;
      this.currentView = `${parentId}-website`;
    },
  },
};
</script>
