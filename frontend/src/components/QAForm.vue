<template>
  <div class="qa-form">
    <div class="header padding-5-percent background-grey">
      <h1>
        <img
          class="img-responsive"
          :src="require('@/assets/sokal-logo.png')"
          alt="Sokal Logo"
        />
        QA Testing Tool
      </h1>
    </div>
    <div class="padding-5-percent">
      <label for="url">Website Homepage URL:</label>
      <input class="website-url" type="text" v-model="url" placeholder="https://gosokal.com" />
      <div class="padding-1"></div>
      <h3>Select Tests:</h3>
      <div class="padding-quarter"></div>
      <div class="flex-column test-checklist">
        <label>
          <input type="checkbox" value="loadTime" v-model="selectedTests" />
          Page Load Time
        </label>
        <label>
          <input type="checkbox" value="titleCheck" v-model="selectedTests" />
          Page Title Check
        </label>
      </div>
      <div class="padding-1"></div>
      <button @click="submitTests">Run Tests</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      selectedTests: [],
    };
  },
  methods: {
    submitTests() {
      this.$emit("run-tests", {
        url: this.url,
        selectedTests: this.selectedTests,
      });
    },
  },
};
</script>

<style>
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
</style>
