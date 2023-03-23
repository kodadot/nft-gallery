<template>
  <div>Flippers</div>
</template>

<script setup lang="ts">
import { Flippers } from '@/components/collection/utils/useCollectionDetails'

defineProps<{
  flippers?: Flippers
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
</style>
