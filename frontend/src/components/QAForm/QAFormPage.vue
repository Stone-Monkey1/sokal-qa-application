<template>
  <div class="qa-form">
    <h2>Single Page QA</h2>
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
    <div v-if="urlError" class="error-message">{{ urlError }}</div>
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
        <AccordionItem title="All Page Tests">
          <label>
            <input
              type="checkbox"
              value="navbarTitleCheckTest"
              v-model="selectedTests"
            />
            Title Check
          </label>
          <label>
            <input
              type="checkbox"
              value="navbarDescriptionCheckTest"
              v-model="selectedTests"
            />
            Description Check
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
            Alt Tag Check
          </label>
          <label>
            <input
              type="checkbox"
              value="navbarImgResponsiveTest"
              v-model="selectedTests"
            />
            Img Responsive Check
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
            Video Check
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
    normalizeUrl(rawUrl) {
      try {
        let urlToParse = rawUrl.trim();

        // Add protocol if missing
        if (!/^https?:\/\//i.test(urlToParse)) {
          urlToParse = "https://" + urlToParse;
        }

        const parsed = new URL(urlToParse);

        if (!parsed.hostname.startsWith("www.")) {
          parsed.hostname = "www." + parsed.hostname;
        }

        return parsed.toString();
      } catch (e) {
        console.error("Invalid URL:", rawUrl);
        return rawUrl;
      }
    },
    emitRunTests() {
      const normalized = this.normalizeUrl(this.url);

      try {
        new URL(normalized); // Validates the final URL
        this.urlError = "";
        this.$emit("tests-started");
        this.$emit("run-tests", {
          url: normalized,
          selectedTests: this.selectedTests,
          mode: "single",
        });
      } catch (e) {
        this.urlError =
          "Please enter a valid URL (e.g., https://www.example.com)";
      }
    },
    selectAllTests() {
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

<style scoped></style>
