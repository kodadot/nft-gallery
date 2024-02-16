<template>
  <div v-if="isDesktop" class="columns mb-2">
    <div class="column is-clipped">
      <div class="flex items-center">
        <nuxt-link :to="`/${urlPrefix}/gallery/${event.Item.id}`" class="h-50">
          <NeoAvatar
            :image-component="NuxtImg"
            :avatar="avatar"
            :placeholder="placeholder"
            :name="event.Item.name"
            :size="50" />
        </nuxt-link>
        <nuxt-link
          class="is-ellipsis inline-block"
          :to="`/${urlPrefix}/gallery/${event.Item.id}`">
          <span class="ml-5 font-bold is-clipped">
            {{ addSnSuffixName(event.Item.name, event.Item.sn) }}
          </span>
        </nuxt-link>
      </div>
    </div>

    <div class="column is-1">
      <div class="h-50 flex items-center">
        <EventTag
          :interaction="event.Type"
          :interaction-name="interactionName"
          distinguish-buy-and-sell />
      </div>
    </div>

    <div class="column is-ellipsis">
      <div class="h-50 flex items-center">
        <div v-if="parseInt(event.Amount)">
          <CommonTokenMoney :value="event.Amount" />
        </div>
        <div v-else>{{ blank }}</div>
      </div>
    </div>

    <div class="column">
      <div class="h-50 flex items-center">
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

    <div v-if="withToColumn" class="column">
      <div class="h-50 flex items-center">
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

    <div class="column">
      <div class="h-50 flex items-center">
        <NeoTooltip :label="event.Date" position="left">
          <BlockExplorerLink :block-id="event.Block" :text="event.Time" />
        </NeoTooltip>
      </div>
    </div>
  </div>
  <!-- Mobile -->
  <div v-else class="mb-6 flex flex-col gap-10px">
    <div class="flex h-70 line-height-1">
      <nuxt-link :to="`/${urlPrefix}/gallery/${event.Item.id}`">
        <div class="mr-5">
          <NeoAvatar
            :image-component="NuxtImg"
            :avatar="avatar"
            :placeholder="placeholder"
            :name="event.Item.name"
            :size="70" />
        </div>
      </nuxt-link>
      <div class="flex flex-col justify-center gap-10px flex-grow">
        <nuxt-link
          class="is-ellipsis inline-block mobile-fixed-width"
          :to="`/${urlPrefix}/gallery/${event.Item.id}`">
          <span class="font-bold">
            {{ event.Item.name }}
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

    <div class="flex gap">
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
import { NeoAvatar, NeoTooltip } from '@kodadot1/brick'
import { Event } from './History.vue'
import {
  blank,
  interactionNameMap,
} from '@/components/collection/activity/events/eventRow/common'
import EventTag from '@/components/collection/activity/events/eventRow/EventTag.vue'
import BlockExplorerLink from '@/components/shared/BlockExplorerLink.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { addSnSuffixName, parseNftAvatar } from '@/utils/nft'

const props = defineProps<{
  event: Event
  withToColumn: boolean
  variant: 'Desktop' | 'Touch'
}>()

const NuxtImg = resolveComponent('NuxtImg')

const { urlPrefix } = usePrefix()
const avatar = ref()
const { placeholder } = useTheme()
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
    avatar.value = await parseNftAvatar(props.event.Item)
  }
}

onMounted(() => {
  getAvatar()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.fixed-width {
  width: 66px;
}

.fixed-height {
  height: 22px;
}
.h-50 {
  height: 50px;
}

.h-70 {
  height: 70px;
}

.mobile-fixed-width {
  @include mobile {
    width: 240px;
  }
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
