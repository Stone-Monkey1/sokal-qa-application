<template>
  <div class="results">
    <h2>Results:</h2>
    <pre>{{ formattedResults }}</pre>
  </div>
</template>

<script>
export default {
  props: ["results"],
  computed: {
    formattedResults() {
      return JSON.stringify(this.results, null, 2);
    },
  },
};
</script>

<style>
.results pre {
  background: #f4f4f4;
  padding: 10px;
}
</style>
