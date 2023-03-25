<template>
  <div>
    <div class="is-flex">
      <div class="mr-5">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="event.nft.name"
          width="40"
          height="40"
          class="border" />
        <img v-else src="/placeholder.webp" class="border" />
      </div>
      <div class="is-flex is-flex-direction-column is-flex-grow-1">
        <div class="is-flex is-justify-content-space-between mb-2">
          <nuxt-link :to="`/${urlPrefix}/gallery/${event.nft.id}`">
            <div class="has-text-weight-bold is-clipped elipsis">
              {{ event.nft.name }}
            </div>
          </nuxt-link>
          <div v-if="amount === blank">
            {{ blank }}
          </div>
          <Money v-else :value="amount" />
        </div>
        <div class="is-flex is-justify-content-space-between">
          <div
            class="border is-size-7 px-4 py-1 is-flex is-align-items-center fixed-width fixed-height"
            :class="interactionClass[event.interaction]">
            <span>{{ interactionName }}</span>
          </div>
          <div>
            {{ timeAgo(event.timestamp) }}
          </div>
        </div>
      </div>
    </div>
    <div class="is-flex mt-4 gap">
      <div class="is-flex is-align-items-center">
        <span class="is-size-7 k-grey mr-3"
          >{{ $t('activity.event.from') }}:</span
        >
        <nuxt-link
          v-if="fromAddress !== blank"
          :to="`/${urlPrefix}/u/${fromAddress}`"
          class="has-text-link">
          <IdentityIndex ref="identity" :address="fromAddress" show-clipboard />
        </nuxt-link>
        <div v-else>
          {{ blank }}
        </div>
      </div>

      <div class="is-flex is-align-items-center">
        <span class="is-size-7 k-grey mr-3"
          >{{ $t('activity.event.to') }}:</span
        >
        <nuxt-link
          v-if="toAddress !== blank"
          :to="`/${urlPrefix}/u/${toAddress}`"
          class="has-text-link">
          <IdentityIndex ref="identity" :address="toAddress" show-clipboard />
        </nuxt-link>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InteractionWithNFT, Offer } from '@/components/collection/utils/types'
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { Interaction } from '@kodadot1/minimark'
import Money from '@/components/shared/format/ChainMoney.vue'
import IdentityIndex from '@/components/identity/IdentityIndex.vue'
import { timeAgo } from '@/components/collection/utils/timeAgo'

const { urlPrefix } = usePrefix()
const props = defineProps<{
  event: InteractionWithNFT | Offer
}>()

const avatar = ref<string>()
const ineteractionNameMap = {
  BUY: 'Sale',
  LIST: 'List',
  MINTNFT: 'Mint',
  SEND: 'Transfer',
}
const blank = '--'

const interactionName = computed(
  () => ineteractionNameMap[props.event.interaction] || props.event.interaction
)
const amount = computed(() => {
  switch (props.event.interaction) {
    case Interaction.MINT:
      return blank
    case Interaction.LIST:
    case Interaction.BUY:
      return props.event.meta
    default:
      return blank
  }
})

const fromAddress = computed(() => {
  const interaction = props.event.interaction
  if (interaction === Interaction.MINTNFT || interaction === Interaction.LIST) {
    return blank
  }
  if (interaction === Interaction.BUY || interaction === Interaction.SEND) {
    return props.event.currentOwner
  }
})

const toAddress = computed(() => {
  const interaction = props.event.interaction
  if (interaction === Interaction.MINTNFT || interaction === Interaction.LIST) {
    return props.event.caller
  }
  if (interaction === Interaction.BUY || interaction === Interaction.SEND) {
    return props.event.caller
  }
})

const interactionClass = {
  [Interaction.MINTNFT]: 'k-yellow',
  [Interaction.LIST]: 'k-blueaccent',
  [Interaction.BUY]: 'k-pink',
  [Interaction.SEND]: 'background-color',
}

onMounted(() => {
  getAvatar()
})

const getAvatar = async () => {
  if (props.event) {
    if (props.event.nft.meta?.image) {
      avatar.value = sanitizeIpfsUrl(props.event.nft.meta.image)
    } else {
      const meta = (await processSingleMetadata(
        props.event.nft.metadata
      )) as NFTMetadata
      avatar.value = sanitizeIpfsUrl(meta?.image)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.fixed-width {
  width: 60px;
}
.fixed-height {
  height: 22px;
}

.gap {
  gap: 1rem;
}
.k-pink {
  @include ktheme() {
    background-color: theme('k-pink');
  }
}
.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}

.k-yellow {
  @include ktheme() {
    background-color: theme('k-yellow');
  }
}

.background-color {
  @include ktheme() {
    background-color: theme('background-color');
  }
}

.k-blueaccent {
  @include ktheme() {
    background-color: theme('k-blueaccent');
  }
}
</style>
