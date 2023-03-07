<template>
  <div
    v-if="count"
    class="count is-flex is-justify-content-center is-align-items-center">
    <span>{{ count }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count?: number
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.count {
  position: absolute;
  bottom: 1.5rem;
  left: -0.75rem;
  height: 1.5rem;
  width: 1.5rem;
  line-height: 1.5rem;
  text-align: center;

  @include ktheme() {
    border: 1px solid theme('border-color');
    background: theme('k-primary');
    color: theme('black');
  }
}
</style>
