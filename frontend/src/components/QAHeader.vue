<template>
  <div class="header padding-5-percent background-grey">
    <div class="header-left">
      <button class="update-btn qa-btn" @click="checkForUpdates">
        Check for Updates
      </button>
      <p>{{ appVersion }}</p>
      <h1>
        <img
          class="img-responsive"
          :src="require('@/assets/sokal-logo.png')"
          alt="Sokal Logo"
        />
        QA Testing Tool
      </h1>
    </div>
  </div>
</template>
<script>
export default {
  name: "QAHeader",
  data() {
    return {
      appVersion: "Loading...", // Default text before fetching version
    };
  },
  async created() {
    if (window.require) {
      try {
        const { ipcRenderer } = window.require("electron");
        this.appVersion = `v${await ipcRenderer.invoke("get-app-version")}`;
      } catch (error) {
        console.error("Failed to fetch app version:", error);
      }
    } else {
      console.warn("Electron not detected. Running in browser mode.");
    }
  },
  methods: {
    async checkForUpdates() {
      if (window.require) {
        try {
          const { ipcRenderer } = window.require("electron");
          await ipcRenderer.invoke("check-for-updates");
        } catch (error) {
          console.error("Failed to check for updates:", error);
        }
      } else {
        console.warn("Electron not detected. Running in browser mode.");
      }
    },
  },
};
</script>
<style>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.header-left .update-btn {
  width: 200px;
}
</style>
