<template>
  <div class="columns mb-2">
    <div class="column">
      <div class="is-flex is-align-items-center">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${event.nft.id}`"
          class="height-50px">
          <img
            v-if="avatar"
            :src="avatar"
            :alt="event.nft.name"
            width="50"
            height="50"
            class="border image-size" />
          <img
            v-else
            :src="placeholder"
            class="border image-size"
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
      <div class="height-50px is-flex is-align-items-center">
        <div
          class="border is-size-7 is-justify-content-center py-1 my-2 is-flex is-align-items-center fixed-width fixed-height"
          :class="getInteractionColor(event.interaction)">
          {{ interactionName }}
        </div>
      </div>
    </div>

    <div class="column">
      <div class="height-50px is-flex is-align-items-center">
        <div v-if="amount === blank">
          {{ blank }}
        </div>
        <CommonTokenMoney v-else :value="amount" />
      </div>
    </div>

    <div class="column">
      <div class="height-50px is-flex is-align-items-center">
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
    </div>
    <div class="column">
      <div class="height-50px is-flex is-align-items-center">
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
    <div class="column">
      <div class="height-50px is-flex is-align-items-center">
        {{ timeAgo(event.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  InteractionWithNFT,
  Offer,
} from '@/composables/collectionActivity/types'
import IdentityIndex from '@/components/identity/IdentityIndex.vue'
import { timeAgo } from '@/components/collection/utils/timeAgo'
import {
  blank,
  getAmount,
  getFromAddress,
  getInteractionColor,
  getNFTAvatar,
  getToAddress,
  interactionNameMap,
} from './common'

const { urlPrefix } = usePrefix()
const { placeholder } = useTheme()
const props = defineProps<{
  event: InteractionWithNFT | Offer
}>()

const avatar = ref<string>()

const interactionName = computed(
  () => interactionNameMap[props.event.interaction] || props.event.interaction
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
.fixed-width {
  width: 66px;
}
.fixed-height {
  height: 22px;
}
.height-50px {
  height: 50px;
}
.image-size {
  width: 50px !important;
  height: 50px !important;
  max-width: none !important;
}

.elipsis {
  text-overflow: ellipsis;
}
</style>
