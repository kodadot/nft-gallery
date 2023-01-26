<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    boundary="viewport"
    placement="bottom"
    :delay="0"
    data-cy="identity">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container p-5">
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
  width: 300px;

  @include ktheme() {
    box-shadow: theme('primary-shadow');
    border: 1px solid theme('text-color');
  }
}
</style>
