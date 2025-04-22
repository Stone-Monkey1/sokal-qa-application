<template>
  <div class="keyword-search-container qa-form">
    <h2>Website Keyword Search</h2>
    <div class="separator-div-small"></div>
    <label for="url">Website Homepage URL:</label>

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
        type="textarea"
        v-model="keywords"
        placeholder="service~customers~Wilmington"
      ></textarea>
    </div>
    <div class="padding-1"></div>
    <button class="qa-btn" @click="submitSearch">Search</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WebsiteKeywordSearch",
  data() {
    return {
      url: "",
      keywords: "",
      error: null,
      loading: false,
    };
  },
  methods: {
    async submitSearch() {
      this.$emit("tests-started"); // 💥 Make loading appear instantly
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          "http://localhost:3000/website-keyword-search",
          {
            url: this.url,
            keywords: this.keywords,
          }
        );

        if (response.data.success) {
          this.$emit("tests-completed", response.data.results);
        } else {
          this.error = "Search failed. Please try again.";
        }
      } catch (err) {
        this.error = `Error: ${err.response?.data?.error || err.message}`;
      } finally {
        this.loading = false;
      }
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
