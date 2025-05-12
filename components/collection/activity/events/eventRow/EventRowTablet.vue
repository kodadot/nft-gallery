<template>
  <div class="mb-6 flex flex-col gap-[10px]">
    <div class="flex h-[70px] leading-none">
      <nuxt-link :to="`/${urlPrefix}/gallery/${event.nft.id}`">
        <div class="mr-5">
          <NeoAvatar
            :image-component="NuxtImg"
            :avatar="avatar"
            :placeholder="placeholder"
            :name="event.nft.name"
            :size="70"
          />
        </div>
      </nuxt-link>
      <div class="flex flex-col justify-center gap-[10px] grow">
        <nuxt-link
          class="truncate inline-block max-sm:w-[240px]"
          :to="`/${urlPrefix}/gallery/${event.nft.id}`"
        >
          <span class="font-bold">
            {{ event.nft.name }}
          </span>
        </nuxt-link>

        <div
          class="border text-xs justify-center flex items-center w-[66px] h-[22px]"
          :class="getInteractionColor(event.interaction)"
        >
          {{ interactionName }}
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="flex justify-between grow">
        <CommonTokenMoney
          v-if="amount !== blank"
          :value="amount"
        />
        <span v-else>
          {{ blank }}
        </span>
        <TimeAgo :timestamp="event.timestamp" />
      </div>
    </div>

    <div class="flex gap-4 max-[400px]:flex-col max-[400px]:gap-0">
      <div
        v-if="fromAddress !== blank"
        class="flex items-center"
      >
        <span class="text-xs mr-3">{{ $t('activity.event.from') }}:</span>
        <nuxt-link
          :to="`/${urlPrefix}/u/${fromAddress}`"
          class="text-k-blue hover:text-k-blue-hover truncate"
        >
          <IdentityIndex
            ref="identity"
            :address="fromAddress"
            show-clipboard
            show-badge
          />
        </nuxt-link>
      </div>

      <div
        v-if="toAddress !== blank"
        class="flex items-center"
      >
        <span class="text-xs mr-3">{{ $t('activity.event.to') }}:</span>
        <nuxt-link
          :to="`/${urlPrefix}/u/${toAddress}`"
          class="text-k-blue hover:text-k-blue-hover truncate"
        >
          <IdentityIndex
            ref="identity"
            :address="toAddress"
            show-clipboard
            show-badge
          />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoAvatar } from '@kodadot1/brick'
import {
  blank,
  getAmount,
  getFromAddress,
  getInteractionColor,
  getNFTAvatar,
  getToAddress,
  interactionNameMap,
} from './common'
import type { InteractionWithNFT } from '@/composables/collectionActivity/types'
import IdentityIndex from '@/components/identity/IdentityIndex.vue'

const NuxtImg = resolveComponent('NuxtImg')

const { urlPrefix } = usePrefix()
const props = defineProps<{
  event: InteractionWithNFT
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
