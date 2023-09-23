<template>
  <UnlockableContainer />
</template>

<script lang="ts">
import UnlockableContainer from '@/components/collection/drop/DropContainer.vue'
export default {
  components: {
    UnlockableContainer,
  },
  layout: 'unlockable-mint-layout',
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
</style>
