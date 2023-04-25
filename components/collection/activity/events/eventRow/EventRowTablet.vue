<template>
  <div class="mb-6 is-flex is-flex-direction-column gap-10px">
    <div class="is-flex height-70px line-height-1">
      <nuxt-link :to="`/${urlPrefix}/gallery/${event.nft.id}`">
        <div class="mr-5">
          <NeoAvatar :avatar="avatar" :name="event.nft.name" :size="70" />
        </div>
      </nuxt-link>
      <div
        class="is-flex is-flex-direction-column is-justify-content-center gap-10px is-flex-grow-1">
        <nuxt-link
          class="is-ellipsis is-inline-block mobile-fixed-width"
          :to="`/${urlPrefix}/gallery/${event.nft.id}`">
          <span class="has-text-weight-bold">
            {{ event.nft.name }}
          </span>
        </nuxt-link>

        <div
          class="border is-size-7 is-justify-content-center is-flex is-align-items-center fixed-width fixed-height"
          :class="getInteractionColor(event.interaction)">
          {{ interactionName }}
        </div>
      </div>
    </div>
    <div class="is-flex">
      <div class="is-flex is-justify-content-space-between is-flex-grow-1">
        <CommonTokenMoney v-if="amount !== blank" :value="amount" />
        <span v-else>
          {{ blank }}
        </span>
        <span>
          {{ timeAgo(event.timestamp) }}
        </span>
      </div>
    </div>

    <div class="is-flex gap">
      <div v-if="fromAddress !== blank" class="is-flex is-align-items-center">
        <span class="is-size-7 mr-3">{{ $t('activity.event.from') }}:</span>
        <nuxt-link
          :to="`/${urlPrefix}/u/${fromAddress}`"
          class="has-text-link is-ellipsis">
          <IdentityIndex ref="identity" :address="fromAddress" show-clipboard />
        </nuxt-link>
      </div>

      <div v-if="toAddress !== blank" class="is-flex is-align-items-center">
        <span class="is-size-7 mr-3">{{ $t('activity.event.to') }}:</span>
        <nuxt-link
          :to="`/${urlPrefix}/u/${toAddress}`"
          class="has-text-link is-ellipsis">
          <IdentityIndex ref="identity" :address="toAddress" show-clipboard />
        </nuxt-link>
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
import { NeoAvatar } from '@kodadot1/brick'

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
@import '@/styles/abstracts/variables';

.fixed-width {
  width: 66px;
}
.mobile-fixed-width {
  @include mobile {
    width: 240px;
  }
}
.fixed-height {
  height: 22px;
}
.height-70px {
  height: 70px;
}
.line-height-1 {
  line-height: 1;
}

.gap-10px {
  gap: 10px;
}

.gap {
  gap: 1rem;
}
</style>
