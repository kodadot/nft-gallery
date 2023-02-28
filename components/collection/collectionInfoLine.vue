<template>
  <div class="is-flex mb-2 is-align-items-center no-wrap">
    <div class="is-size-7 k-grey mr-5 is-flex-grow-1">{{ title }}:</div>
    <slot>
      <div>{{ value }}</div>
    </slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
  value?: string
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
