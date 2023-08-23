<template>
  <div
    class="unlockable-container is-flex border py-2 px-6 is-justify-content-space-between">
    <NeoTooltip
      :label="$t('unlockable.tooltip')"
      multiline
      multiline-width="15rem">
      <div class="is-flex is-align-items-center">
        <img class="mr-2" :src="unlockableIcon" alt="Unlockable Icon" />
        <span class="has-text-grey is-size-7">{{ $t('unlockable.item') }}</span>
      </div>
    </NeoTooltip>
    <div class="is-flex is-align-items-center">
      <span>Mint Your NFT and Unlock Free Merch</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoTooltip } from '@kodadot1/brick'
import { useUnlockableIcon } from '@/composables/useUnlockableIcon'

const { unlockableIcon } = useUnlockableIcon()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.unlockable-container {
  border-radius: 2rem;
  @include ktheme() {
    border-color: theme('k-shade');
  }
}

@include until-widescreen {
  .unlockable-container {
    max-width: 100%;
  }
}
</style>
