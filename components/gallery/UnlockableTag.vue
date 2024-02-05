<template>
  <div class="unlockable-container flex border py-2 px-6 justify-between">
    <NeoTooltip
      :active="!isOwner"
      :label="$t('unlockable.tooltip')"
      multiline
      multiline-width="15rem">
      <div class="flex items-center">
        <img class="mr-2" :src="unlockableIcon" alt="Unlockable Icon" />
        <span class="text-k-grey text-xs">{{ $t('unlockable.item') }}</span>
      </div>
    </NeoTooltip>
    <div class="flex items-center">
      <a
        v-if="isOwner && link"
        v-safe-href="link"
        target="_blank"
        rel="nofollow noopener noreferrer"
        class="text-k-blue hover:text-k-blue-hover">
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
import { useIcon } from '@/composables/useIcon'

const props = defineProps<{
  nft: NFT | undefined
  link: string | undefined
}>()

const { isCurrentOwner } = useAuth()
const { isMobile } = useViewport()
const { unlockableIcon } = useIcon()

const isOwner = computed(() => isCurrentOwner(props.nft?.currentOwner))
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.unlockable-container {
  @apply max-w-[60%] rounded-[2rem];

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
