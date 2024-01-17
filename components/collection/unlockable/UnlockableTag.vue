<template>
  <div
    v-if="isUnlockable"
    class="unlockable-container rounded-[2rem] flex border py-2 px-6 justify-between">
    <NeoTooltip
      :label="$t('unlockable.tooltip')"
      multiline
      multiline-width="15rem">
      <div class="flex items-center">
        <img class="mr-2" :src="unlockableIcon" alt="Unlockable Icon" />
        <span class="text-k-grey text-xs">{{ $t('unlockable.item') }}</span>
      </div>
    </NeoTooltip>
    <div class="flex items-center">
      <span>Mint Your NFT and Unlock Free Merch</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoTooltip } from '@kodadot1/brick'
import { useIcon } from '@/composables/useIcon'

const { unlockableIcon } = useIcon()

const props = defineProps({
  collectionId: {
    type: String,
    default: '',
  },
})
const { isUnlockable } = useUnlockable(
  computed(() => ({ id: props.collectionId })),
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.unlockable-container {
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
