<template>
  <div class="qa-form">
    <!-- Just adding this to make it easier to test things -->
    <div class="padding-2-percent">
      <a href="https://stone-monkey1.github.io/sokal-qa-playground/"
        >https://stone-monkey1.github.io/sokal-qa-playground/</a
      >
    </div>
    <div class="padding-5-percent">
      <label for="url">Website Homepage URL:</label>
      <input
        class="website-url"
        type="text"
        v-model="url"
        placeholder="https://gosokal.com"
      />
      <div class="padding-1"></div>
      <h3>Select Tests:</h3>
      <div class="padding-quarter"></div>
      <div class="flex-column test-checklist">
        <label>
          <input
            type="checkbox"
            value="navbarTitleCheckTest"
            v-model="selectedTests"
          />
          Navbar Title Check
        </label>
        <label>
          <input
            type="checkbox"
            value="navbarH1CheckTest"
            v-model="selectedTests"
          />
          H1 Check
        </label>
        <label>
          <input
            type="checkbox"
            value="navbarImgAltTagTest"
            v-model="selectedTests"
          />
          Alt Tags
        </label>
        <label>
          <input
            type="checkbox"
            value="navbarImgResponsiveTest"
            v-model="selectedTests"
          />
          Img Responsive
        </label>
        <label>
          <input
            type="checkbox"
            value="navbarSpellCheckTest"
            v-model="selectedTests"
          />
          Spell Check
        </label>
        <label>
          <input
            type="checkbox"
            value="navbarCheckVideo"
            v-model="selectedTests"
          />
          Check for Videos
        </label>
        <label>
          <input
            type="checkbox"
            value="homepageTabbedSearchFilterTest"
            v-model="selectedTests"
          />
          Check for 7.09% Excellent Credit tooltip
        </label>
        <label>
          <input
            type="checkbox"
            value="homepageQuickLinksTest"
            v-model="selectedTests"
          />
          Check Homepage Quick Links
        </label>
        <label>
          <input
            type="checkbox"
            value="homepageVehicleCarouselTest"
            v-model="selectedTests"
          />
          Vehicle Carousel
        </label>
        <label>
          <input
            type="checkbox"
            value="homepageInteractionBarTest"
            v-model="selectedTests"
          />
          Interaction Bar
        </label>
      </div>
      <div class="padding-1"></div>
      <button @click="emitRunTests">Run Tests</button>
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
    emitRunTests() {
      this.$emit("tests-started");
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
