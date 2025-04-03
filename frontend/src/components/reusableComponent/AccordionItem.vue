<template>
  <div class="accordion-item">
    <div class="accordion-header" @click="toggle">
      <h4>{{ title }}</h4>
      <span>{{ isOpen ? "−" : "+" }}</span>
    </div>
    <transition name="accordion">
      <div v-show="isOpen" class="accordion-body">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    initiallyOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: this.initiallyOpen,
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style>
.accordion-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem;
}
.accordion-body {
  padding: 0.5rem 0;
}
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.3s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  overflow: hidden;
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 300px; /* or whatever max height is suitable */
}
</style>
