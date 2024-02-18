<template>
  <div class="flex gap-2 py-[.65rem]">
    <div class="flex-1 overflow-clip">
      <div class="flex items-center">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${event.nft.id}`"
          class="height-50px">
          <NeoAvatar
            :image-component="NuxtImg"
            :avatar="avatar"
            :placeholder="placeholder"
            :name="event.nft.name"
            :size="50" />
        </nuxt-link>
        <nuxt-link
          class="is-ellipsis inline-block"
          :to="`/${urlPrefix}/gallery/${event.nft.id}`">
          <span class="ml-5 font-bold is-clipped">
            {{ event.nft.name }}
          </span>
        </nuxt-link>
      </div>
    </div>

    <div class="w-1/12">
      <div class="height-50px flex items-center">
        <EventTag
          :interaction="event.interaction"
          :interaction-name="interactionName" />
      </div>
    </div>

    <div class="flex-1 text-ellipsis">
      <div class="height-50px flex items-center">
        <div v-if="amount === blank">
          {{ blank }}
        </div>
        <CommonTokenMoney v-else :value="amount" />
      </div>
    </div>

    <div class="flex-1">
      <div class="height-50px flex items-center">
        <nuxt-link
          v-if="fromAddress !== blank"
          :to="`/${urlPrefix}/u/${fromAddress}`"
          class="text-k-blue hover:text-k-blue-hover">
          <IdentityIndex
            ref="identity"
            :address="fromAddress"
            show-clipboard
            show-badge />
        </nuxt-link>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>
    <div class="flex-1">
      <div class="height-50px flex items-center">
        <nuxt-link
          v-if="toAddress !== blank"
          :to="`/${urlPrefix}/u/${toAddress}`"
          class="text-k-blue hover:text-k-blue-hover">
          <IdentityIndex
            ref="identity"
            :address="toAddress"
            show-clipboard
            show-badge />
        </nuxt-link>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>
    <div class="flex-1">
      <TimeAgo
        custom-class="height-50px flex items-center"
        :timestamp="event.timestamp" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  InteractionWithNFT,
  Offer,
} from '@/composables/collectionActivity/types'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import IdentityIndex from '@/components/identity/IdentityIndex.vue'

import {
  blank,
  getAmount,
  getFromAddress,
  getNFTAvatar,
  getToAddress,
  interactionNameMap,
} from './common'
import EventTag from './EventTag.vue'
import { NeoAvatar } from '@kodadot1/brick'

const NuxtImg = resolveComponent('NuxtImg')

const { urlPrefix } = usePrefix()
const props = defineProps<{
  event: InteractionWithNFT | Offer
}>()

const avatar = ref<string>()
const { placeholder } = useTheme()

const interactionName = computed(
  () =>
    interactionNameMap()[props.event.interaction] || props.event.interaction,
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
</style>
