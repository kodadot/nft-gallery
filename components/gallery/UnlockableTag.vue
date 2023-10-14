<template>
  <div
    class="unlockable-container is-flex border py-2 px-6 is-justify-content-space-between">
    <NeoTooltip
      :active="!isOwner"
      :label="$t('unlockable.tooltip')"
      multiline
      multiline-width="15rem">
      <div class="is-flex is-align-items-center">
        <img class="mr-2" :src="unlockableIcon" alt="Unlockable Icon" />
        <span class="has-text-grey is-size-7">{{ $t('unlockable.item') }}</span>
      </div>
    </NeoTooltip>
    <div class="is-flex is-align-items-center">
      <a
        v-if="isOwner && link"
        v-safe-href="link"
        target="_blank"
        rel="nofollow noopener noreferrer"
        class="has-text-link">
        {{
          isMobile
            ? $t('unlockable.claimDrop')
            : $t('unlockable.claimPhysicalDrop')
        }}
      </a>
      <span v-else>{{ $t('unlockable.ownerOnly') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoTooltip } from '@kodadot1/brick'
import { NFT } from '@/components/rmrk/service/scheme'
import { useWindowSize } from '@vueuse/core'
import { useUnlockableIcon } from '@/composables/useUnlockableIcon'

const props = defineProps<{
  nft: NFT | undefined
  link: string | undefined
}>()

const { isCurrentOwner } = useAuth()
const isMobile = computed(() => useWindowSize().width.value < 768)
const { unlockableIcon } = useUnlockableIcon()

const isOwner = isCurrentOwner(props.nft?.currentOwner)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.unlockable-container {
  max-width: 60%;
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
