<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="[100, 800]"
    data-cy="identity">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container p-5 ms-dos-shadow">
      <IdentityPopoverHeader />
      <IdentityPopoverFooter :sold-items="nftEntities" />
    </div>
  </v-tippy>
</template>

<script lang="ts" setup>
import { useIdentitySoldData } from '../utils/useIdentity'

const IdentityPopoverHeader = defineAsyncComponent(
  () => import('./IdentityPopoverHeader.vue')
)
const IdentityPopoverFooter = defineAsyncComponent(
  () => import('./IdentityPopoverFooter.vue')
)

const address = inject('address')

const { nftEntities } = useIdentitySoldData({
  address,
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.tippy-container {
  display: inline-block;
}

.popover-content-container {
  border: 1px solid $black;
  width: 300px;
}

.ms-dos-shadow {
  box-shadow: $primary-shadow;
}
</style>
