<template>
  <div class="is-flex mb-2 is-align-items-center no-wrap">
    <div class="is-size-7 k-grey">{{ title }}:</div>
    <div class="gap is-flex-grow-1" />
    <slot>
      <div class="is-flex-grow-1 text-right">{{ value }}</div>
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

.text-right {
  text-align: right;
}
.gap {
  min-width: 1.5rem;
}
.no-wrap {
  white-space: nowrap;
}

.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
