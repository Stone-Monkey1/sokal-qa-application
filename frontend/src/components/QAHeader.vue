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
    <div class="header-right">
      <button class="todo-toggle-btn" @click.stop="$emit('toggle-todo')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M16 2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4"
          ></path>
          <rect x="9" y="2" width="6" height="4" rx="1"></rect>
        </svg>
      </button>
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

.todo-toggle-btn {
  padding: 10px 15px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}
.todo-toggle-btn:hover {
  background-color: #e0e0e0;
}
</style>
