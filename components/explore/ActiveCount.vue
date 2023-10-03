<template>
  <div
    v-if="count"
    class="count is-flex is-justify-content-center is-align-items-center"
    :class="{ rounded: rounded }">
    {{ count }}
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    rounded?: boolean
  }>(),
  {
    rounded: false,
    count: 0,
  }
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

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

.rounded {
  border-radius: 10rem;
}
</style>
