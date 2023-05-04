<template>
  <div
    class="unlockable-container is-flex border py-2 px-6 is-justify-content-space-between">
    <NeoTooltip :active="!isOwner" :label="$t('unlockable.tooltip')" multiline>
      <div class="is-flex is-align-items-center">
        <img class="mr-2" :src="unlockableIcon" alt="Unlockable Icon" />
        <span class="has-text-grey is-size-7">{{ $t('unlockable.item') }}</span>
      </div>
    </NeoTooltip>
    <div class="is-flex is-align-items-center">
      <nuxt-link
        v-if="isOwner"
        :to="{
          path: `/${urlPrefix}/gallery/${nft.id}`,
          query: { unlockable: true },
        }"
        class="has-text-link">
        {{
          isMobile
            ? $t('unlockable.claimDrop')
            : $t('unlockable.claimPhysicalDrop')
        }}
      </nuxt-link>
      <span v-else>{{ $t('unlockable.ownerOnly') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoTooltip } from '@kodadot1/brick'
import { isOwner as checkOwner } from '@/utils/account'
import { NFT } from '@/components/rmrk/service/scheme'
import { useWindowSize } from '@vueuse/core'
import { useUnlockableIcon } from '@/composables/useUnlockableIcon'

const props = defineProps<{
  nft: NFT | undefined
}>()

const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const isMobile = computed(() => useWindowSize().width.value < 768)
const { unlockableIcon } = useUnlockableIcon()

const isOwner = computed(() =>
  checkOwner(props.nft?.currentOwner, accountId.value)
)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables.scss';
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
