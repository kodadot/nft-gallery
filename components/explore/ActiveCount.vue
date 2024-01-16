<template>
  <div
    v-if="count"
    class="count text-center flex justify-center items-center"
    :class="[`count--${position}`, { rounded: rounded }]">
    {{ count }}
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    rounded?: boolean
    position?: string
  }>(),
  {
    rounded: false,
    count: 0,
    position: 'top-left' as 'top-left' | 'top-right',
  },
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.count {
  position: absolute;
  height: 1.5rem;
  width: 1.5rem;
  line-height: 1.5rem;

  &--top-left {
    bottom: 1.5rem;
    left: -0.75rem;
  }

  &--top-right {
    bottom: 1.5rem;
    right: -0.75rem;
  }

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
