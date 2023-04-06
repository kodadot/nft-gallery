<template>
  <div v-if="route.name?.includes('prefix-collection-id')">
    <NeoTooltip label="Coming Soon" position="bottom" :append-to-body="false">
      <NeoButton label="Make Collection Offer" disabled class="offer w-100" />
    </NeoTooltip>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoTooltip } from '@kodadot1/brick'

const route = useRoute()
</script>

<style scoped lang="scss">
// somehow, button disabled wrapped in tooltip is bigger by 2px vertically 🤔
// we can remove this once the button enabled
.offer {
  padding: 6px 12px;
}
</style>
