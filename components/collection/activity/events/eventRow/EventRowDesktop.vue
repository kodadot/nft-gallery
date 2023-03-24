<template>
  <div class="columns">
    <div class="column">
      <div class="is-flex is-align-items-center">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="event.nft.name"
          width="40"
          height="40"
          class="border" />
        <img v-else src="/placeholder.webp" class="border" />
        <div class="ml-5 has-text-weight-bold is-clipped elipsis">
          {{ event.nft.name }}
        </div>
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
import { InteractionWithNFT } from '@/components/collection/utils/types'
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { Interaction } from '@kodadot1/minimark'
import Money from '@/components/shared/format/ChainMoney.vue'
import IdentityIndex from '@/components/identity/IdentityIndex.vue'
import { timeAgo } from '../../utils'

const { urlPrefix } = usePrefix()
const props = defineProps<{
  event: InteractionWithNFT
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
