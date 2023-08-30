<template>
  <UnlockableContainer />
</template>

<script lang="ts" setup>
import UnlockableContainer from '@/components/collection/unlockable/UnlockableContainer.vue'

definePageMeta({
  layout: 'unlockable-mint-layout',
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
</style>
