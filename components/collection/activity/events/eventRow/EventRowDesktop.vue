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
        :class="interactionColor[event.interaction]">
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
import { InteractionWithNFT, Offer } from '@/components/collection/utils/types'
import Money from '@/components/shared/format/ChainMoney.vue'
import IdentityIndex from '@/components/identity/IdentityIndex.vue'
import { timeAgo } from '@/components/collection/utils/timeAgo'
import {
  blank,
  getAmount,
  getFromAddress,
  getNFTAvatar,
  getToAddress,
  ineteractionNameMap,
  interactionColor,
} from './common'

const { urlPrefix } = usePrefix()
const props = defineProps<{
  event: InteractionWithNFT | Offer
}>()

const avatar = ref<string>()

const interactionName = computed(
  () => ineteractionNameMap[props.event.interaction] || props.event.interaction
)
const amount = computed(() => getAmount(props.event))

const fromAddress = computed(() => getFromAddress(props.event))

const toAddress = computed(() => getToAddress(props.event))

onMounted(() => {
  getAvatar()
})

const getAvatar = async () => {
  if (props.event) {
    avatar.value = await getNFTAvatar(props.event)
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
