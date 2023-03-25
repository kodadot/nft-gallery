<template>
  <div class="columns">
    <div class="column">
      <div class="is-flex is-align-items-center">
        <nuxt-link :to="`/${urlPrefix}/gallery/${event.nft.id}`">
          <img
            v-if="avatar"
            :src="avatar"
            :alt="event.nft.name"
            width="50"
            height="50"
            class="border" />
          <img
            v-else
            src="/placeholder.webp"
            class="border"
            width="50"
            height="50" />
        </nuxt-link>
        <nuxt-link :to="`/${urlPrefix}/gallery/${event.nft.id}`">
          <div class="ml-5 has-text-weight-bold is-clipped elipsis">
            {{ event.nft.name }}
          </div>
        </nuxt-link>
      </div>
    </div>

    <div class="column">
      <div
        class="border is-size-7 px-4 py-1 my-2 is-flex is-align-items-center fixed-width fixed-height"
        :class="interactionClass[event.interaction]">
        <span>{{ interactionName }}</span>
      </div>
    </div>

    <div class="column">
      <div v-if="amount === blank">
        {{ blank }}
      </div>
      <Money v-else :value="amount" />
    </div>

    <div class="column">
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
    <div class="column">
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
    <div class="column">
      {{ timeAgo(event.timestamp) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  InteractionWithNFT,
  Offer,
  OfferInteraction,
} from '@/components/collection/utils/types'
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
  Offer: 'Offer',
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
      return (props.event as InteractionWithNFT).meta
    case OfferInteraction:
      return (props.event as Offer).price
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
    return (props.event as InteractionWithNFT).currentOwner
  }
  if (interaction === OfferInteraction) {
    return (props.event as Offer).caller
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
  return blank
})

const interactionClass = {
  [Interaction.MINTNFT]: 'k-yellow',
  [Interaction.LIST]: 'k-blueaccent',
  [Interaction.BUY]: 'k-pink',
  [OfferInteraction]: 'k-greenaccent',
  [Interaction.SEND]: 'background-color',
}

onMounted(() => {
  getAvatar()
})

const getAvatar = async () => {
  if (props.event) {
    if (props.event.nft?.meta?.image) {
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
.k-pink {
  @include ktheme() {
    background-color: theme('k-pink');
  }
}
.k-greenaccent {
  @include ktheme() {
    background-color: theme('k-greenaccent');
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
.elipsis {
  text-overflow: ellipsis;
}
</style>
