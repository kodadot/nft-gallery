<template>
  <tippy
    class="tippy-container"
    :append-to="body"
    boundary="viewport"
    :delay="0"
    data-testid="identity-tippy-link"
    :on-show="() => (showContent = true)">
    <slot name="content" />

    <template #content>
      <div
        v-if="showContent"
        class="popover-content-container p-5"
        data-testid="identity-popover-container">
        <IdentityPopoverHeader />
        <IdentityPopoverFooter :nfts="nftEntities" />
      </div>
    </template>
  </tippy>
</template>

<script lang="ts" setup>
import { useIdentitySoldData } from '../utils/useIdentity'

import IdentityPopoverHeader from './IdentityPopoverHeader.vue'
import IdentityPopoverFooter from './IdentityPopoverFooter.vue'

const address = inject('address')
const body = ref(document.body)

const { nftEntities } = useIdentitySoldData({ address })

const showContent = ref(false)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.tippy-container {
  display: inline-block;
}

.popover-content-container {
  width: 300px;

  @include ktheme() {
    background: theme('background-color');
    box-shadow: theme('primary-shadow');
    border: 1px solid theme('border-color');
  }
}
</style>
