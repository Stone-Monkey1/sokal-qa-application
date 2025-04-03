<template>
  <div class="qa-form">
    <h2>Website QA</h2>
    <div class="separator-div-small"></div>
    <!-- Just adding this to make it easier to test things -->
    <div class="padding-2-percent">
      <a href="https://stone-monkey1.github.io/sokal-qa-playground/"
        >https://stone-monkey1.github.io/sokal-qa-playground/</a
      >
    </div>

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
    <div class="select-toggle-buttons">
      <button class="qa-btn" type="button" @click="selectAllTests">
        Select All
      </button>
      <button class="qa-btn" type="button" @click="deselectAllTests">
        Deselect All
      </button>
    </div>
    <div class="padding-quarter"></div>
    <div class="test-accordion">
      <div class="flex-column test-checklist">
        <AccordionItem title="Homepage Tests">
          <label>
            <input
              type="checkbox"
              value="homepageNavbarImgAltTagTest"
              v-model="selectedTests"
            />
            Navbar Img Alt Tag
          </label>
          <label>
            <input
              type="checkbox"
              value="homepageNavbarImgResponsiveTest"
              v-model="selectedTests"
            />
            Navbar Img Responsive
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
        </AccordionItem>
      </div>
      <div class="flex-column test-checklist">
        <AccordionItem title="All Page Tests">
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
              value="navbarDescriptionCheckTest"
              v-model="selectedTests"
            />
            Navbar Description Check
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
        </AccordionItem>
      </div>
    </div>
    <div class="padding-1"></div>
    <button class="qa-btn" @click="emitRunTests">Run Tests</button>
  </div>
</template>

<script>
import AccordionItem from "../reusableComponent/AccordionItem.vue";

export default {
  components: {
    AccordionItem,
  },
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
    selectAllTests() {
      // Grab all checkbox inputs with a `value` inside test checklist
      const checkboxes = this.$el.querySelectorAll(
        ".test-checklist input[type='checkbox'][value]"
      );
      const allValues = Array.from(checkboxes).map((el) => el.value);
      this.selectedTests = allValues;
    },
    deselectAllTests() {
      this.selectedTests = [];
    },
  },
};
</script>

<style>

</style>
