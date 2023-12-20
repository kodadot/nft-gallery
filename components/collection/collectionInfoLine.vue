<template>
  <div class="flex mb-2 items-center no-wrap">
    <div class="is-size-7 k-grey pr-4 flex-grow">{{ title }}:</div>
    <div class="has-text-weight-bold flex">
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
@import '@/assets/styles/abstracts/variables';

.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
