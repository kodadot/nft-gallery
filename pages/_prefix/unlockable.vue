<template>
  <UnlockableContainer />
</template>

<script lang="ts">
import UnlockableContainer from '@/components/collection/unlockable/UnlockableContainer.vue'
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
