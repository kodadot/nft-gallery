<template>
  <NeoTooltip
    :active="!isOwner"
    label="unlock-able content is revealed after purchase"
    :append-to-body="true">
    <div
      class="unlockable-container is-flex border py-2 px-6 is-justify-content-space-between">
      <div class="is-flex is-align-items-center">
        <img class="mr-2" :src="unloackableIcon" alt="Unlockable Icon" />
        <span class="has-text-grey is-size-7">Unlock-Able item</span>
      </div>
      <nuxt-link
        v-if="isOwner"
        :to="{
          path: `/${urlPrefix}/gallery/${nft.id}`,
          query: { unlockable: true },
        }"
        class="has-text-link">
        {{ `Claim ${isMobile ? '' : 'Physical'} Drop` }}
      </nuxt-link>

      <span v-else>Owner Only</span>
    </div>
  </NeoTooltip>
</template>

<script lang="ts" setup>
import unloackableDark from '@/assets/unlockable-dark.svg'
import unloackable from '@/assets/unlockable.svg'
import { NeoTooltip } from '@kodadot1/brick'
import { isOwner as checkOwner } from '@/utils/account'
import { NFT } from '@/components/rmrk/service/scheme'
import { useWindowSize } from '@vueuse/core'

const props = defineProps<{
  nft: NFT | undefined
}>()

const { isDarkMode } = useTheme()
const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const isMobile = computed(() => useWindowSize().width.value < 768)

const isOwner = computed(() =>
  checkOwner(props.nft?.currentOwner, accountId.value)
)
const unloackableIcon = computed(() =>
  isDarkMode.value ? unloackableDark : unloackable
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
