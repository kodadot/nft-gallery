<template>
  <VoteDropContainer />
</template>

<script lang="ts">
import VoteDropContainer from '@/components/collection/voteDrop/DropContainer.vue'
export default {
  components: {
    VoteDropContainer,
  },
  layout: 'unlockable-mint-layout',
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
</style>
