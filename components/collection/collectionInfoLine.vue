<template>
  <div class="is-flex mb-2 is-align-items-center no-wrap">
    <div class="is-size-7 k-grey pr-4 is-flex-grow-1">{{ title }}:</div>
    <div class="has-text-weight-bold">
      <slot>
        <div>{{ value }}</div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
  value?: string | number
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
