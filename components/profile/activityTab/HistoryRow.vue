<template>
  <div v-if="isDesktop" class="flex gap-3 py-[.6rem]">
    <div class="flex-1 is-clipped">
      <div class="flex items-center">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${event.Item.id}`"
          class="h-[50px]">
          <BaseMediaItem
            class="border border-k-shade w-[3.125rem] h-[3.125rem]"
            :alt="event.Item.name"
            :src="image"
            :animation-src="animationUrl"
            preview
            is-detail />
        </nuxt-link>
        <nuxt-link
          class="is-ellipsis inline-block"
          :to="`/${urlPrefix}/gallery/${event.Item.id}`">
          <span class="ml-5 font-bold is-clipped">
            {{ nameWithIndex(event.Item.name, event.Item.sn) }}
          </span>
        </nuxt-link>
      </div>
    </div>

    <div class="w-1/12">
      <div class="h-[50px] flex items-center">
        <EventTag
          :interaction="event.Type"
          :interaction-name="interactionName"
          distinguish-buy-and-sell />
      </div>
    </div>

    <div class="flex-1 is-ellipsis">
      <div class="h-[50px] flex items-center">
        <div v-if="parseInt(event.Amount)">
          <CommonTokenMoney :value="event.Amount" />
        </div>
        <div v-else>{{ blank }}</div>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <nuxt-link
          v-if="!!fromAddress"
          :to="`/${urlPrefix}/u/${fromAddress}`"
          class="text-k-blue hover:text-k-blue-hover">
          <IdentityIndex ref="identity" :address="fromAddress" show-clipboard />
        </nuxt-link>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>

    <div v-if="withToColumn" class="flex-1">
      <div class="h-[50px] flex items-center">
        <nuxt-link
          v-if="!!toAddress"
          :to="`/${urlPrefix}/u/${toAddress}`"
          class="text-k-blue hover:text-k-blue-hover">
          <IdentityIndex ref="identity" :address="toAddress" show-clipboard />
        </nuxt-link>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <NeoTooltip :label="event.Date" position="left">
          <BlockExplorerLink :block-id="event.Block" :text="event.Time" />
        </NeoTooltip>
      </div>
    </div>
  </div>
  <!-- Mobile -->
  <div v-else class="mb-6 flex flex-col gap-[10px]">
    <div class="flex h-[70px] leading-[1]">
      <nuxt-link :to="`/${urlPrefix}/gallery/${event.Item.id}`">
        <div class="mr-5">
          <BaseMediaItem
            class="border border-k-shade w-[4.375rem] h-[4.375rem]"
            :alt="event.Item.name"
            :src="image"
            :animation-src="animationUrl"
            preview
            is-detail />
        </div>
      </nuxt-link>
      <div class="flex flex-col justify-center gap-[10px] flex-grow">
        <nuxt-link
          class="is-ellipsis inline-block w-60"
          :to="`/${urlPrefix}/gallery/${event.Item.id}`">
          <span class="font-bold">
            {{ nameWithIndex(event.Item.name, event.Item.sn) }}
          </span>
        </nuxt-link>

        <EventTag
          :interaction="event.Type"
          :interaction-name="interactionName"
          distinguish-buy-and-sell />
      </div>
    </div>
    <div class="flex">
      <div class="flex justify-between flex-grow">
        <div v-if="parseInt(event.Amount)">
          <CommonTokenMoney :value="event.Amount" />
        </div>
        <div v-else>{{ blank }}</div>
        <NeoTooltip :label="event.Date" position="left">
          <BlockExplorerLink :block-id="event.Block" :text="event.Time" />
        </NeoTooltip>
      </div>
    </div>

    <div class="flex gap-4">
      <div v-if="!!fromAddress" class="flex items-center">
        <span class="text-xs mr-3">{{ $t('activity.event.from') }}:</span>
        <nuxt-link
          :to="`/${urlPrefix}/u/${fromAddress}`"
          class="text-k-blue hover:text-k-blue-hover is-ellipsis">
          <IdentityIndex ref="identity" :address="fromAddress" show-clipboard />
        </nuxt-link>
      </div>

      <div v-if="!!toAddress" class="flex items-center">
        <span class="text-xs mr-3">{{ $t('activity.event.to') }}:</span>
        <nuxt-link
          :to="`/${urlPrefix}/u/${toAddress}`"
          class="text-k-blue hover:text-k-blue-hover is-ellipsis">
          <IdentityIndex ref="identity" :address="toAddress" show-clipboard />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoTooltip } from '@kodadot1/brick'
import { Event } from './History.vue'
import {
  blank,
  interactionNameMap,
} from '@/components/collection/activity/events/eventRow/common'
import EventTag from '@/components/collection/activity/events/eventRow/EventTag.vue'
import BlockExplorerLink from '@/components/shared/BlockExplorerLink.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { nameWithIndex } from '@/utils/nft'

const props = defineProps<{
  event: Event
  withToColumn: boolean
  variant: 'Desktop' | 'Touch'
}>()

const { urlPrefix } = usePrefix()
const image = ref()
const animationUrl = ref()
const fromAddress = computed(() => props.event.From)
const toAddress = computed(() => props.event.To)
const isDesktop = computed(() => props.variant === 'Desktop')

const interactionName = computed(
  () =>
    interactionNameMap({ distinguishBuyAndSell: true })[props.event.Type] ||
    props.event.Type,
)

const getAvatar = async () => {
  if (props.event.Item) {
    const meta = await getNftMetadata(props.event.Item, urlPrefix.value)
    image.value = meta.image
    animationUrl.value = meta.animationUrl
  }
}

onBeforeMount(getAvatar)
</script>
