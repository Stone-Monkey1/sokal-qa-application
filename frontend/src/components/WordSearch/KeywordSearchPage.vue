<template>
  <div class="keyword-search-container qa-form">
    <h2>Single Page Keyword Search</h2>
    <div class="separator-div-small"></div>
    <label for="url">Single Page URL:</label>
    <input
      class="website-url"
      type="text"
      v-model="url"
      placeholder="https://gosokal.com"
    />
    <div class="padding-quarter"></div>
    <div class="display-flex flex-column">
      <label for="keyword-input">Words or Phrases separated by ~:</label>
      <div class="padding-quarter"></div>
      <textarea
        class="keyword-input"
        v-model="keywords"
        placeholder="service~customers~Wilmington"
      ></textarea>
    </div>
    <div class="padding-1"></div>
    <button class="qa-btn" @click="submitSearch">Search</button>
  </div>
</template>

<script>
export default {
  name: "WebsiteKeywordSearch",
  data() {
    return {
      url: "",
      keywords: "",
      error: null,
    };
  },
  methods: {
    submitSearch() {
      this.$emit("tests-started");

      this.$emit("run-tests", {
        url: this.url,
        keywords: this.keywords,
        mode: "single",
      });
    },
  },
};
</script>

<style scoped>
textarea {
  width: 100%;
  margin: auto;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
