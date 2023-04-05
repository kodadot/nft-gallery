<template>
  <div class="mb-5">
    <div class="is-flex height-50px line-height-1">
      <nuxt-link :to="`/${urlPrefix}/gallery/${event.nft.id}`">
        <div class="mr-5">
          <img
            v-if="avatar"
            :src="avatar"
            :alt="event.nft.name"
            width="50"
            height="50"
            class="border image-size" />
          <img
            v-else
            src="/placeholder.webp"
            class="border image-size"
            width="50"
            height="50" />
        </div>
      </nuxt-link>
      <div
        class="is-flex is-flex-direction-column is-flex-grow-1 is-justify-content-space-between">
        <div class="is-flex is-justify-content-space-between">
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
        <div
          class="is-flex is-justify-content-space-between is-align-items-center">
          <div
            class="border is-size-7 is-justify-content-center py-1 is-flex is-align-items-center fixed-width fixed-height"
            :class="getInteractionColor(event.interaction)">
            {{ interactionName }}
          </div>
          <div>
            {{ timeAgo(event.timestamp) }}
          </div>
        </div>
      </div>
    </div>
    <div class="is-flex mt-4 gap">
      <div class="is-flex is-align-items-center">
        <span class="is-size-7 mr-3">{{ $t('activity.event.from') }}:</span>
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
        <span class="is-size-7 mr-3">{{ $t('activity.event.to') }}:</span>
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
import {
  InteractionWithNFT,
  Offer,
} from '@/composables/collectionActivity/types'
import Money from '@/components/shared/format/ChainMoney.vue'
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
.image-size {
  width: 50px !important;
  height: 50px !important;
}
.height-50px {
  height: 50px;
}
.line-height-1 {
  line-height: 1;
}

.gap {
  gap: 1rem;
}
</style>
