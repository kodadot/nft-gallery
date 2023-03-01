<template>
  <FrequentlyAsked />
</template>

<script lang="ts" setup>
const FrequentlyAsked = defineAsyncComponent(
  () => import('@/components/common/FrequentlyAsked.vue')
)
</script>
