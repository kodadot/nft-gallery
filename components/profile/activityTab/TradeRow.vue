<template>
  <div
    v-if="isDesktop"
    class="flex gap-3 py-[.6rem]"
  >
    <div class="flex-1 is-clipped">
      <div class="flex items-center">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${trade.desired.id}`"
          class="h-[50px]"
        >
          <BaseMediaItem
            class="border border-k-shade w-[3.125rem] h-[3.125rem]"
            alt="offer.Item.name"
            :src="image"
            :animation-src="!image ? animationUrl : undefined"
            preview
            is-detail
          />
        </nuxt-link>
        <nuxt-link
          class="is-ellipsis inline-block"
          :to="`/${urlPrefix}/gallery/${trade.desired.id}`"
        >
          <span class="ml-5 font-bold is-clipped">
            {{ trade.desired.name }}
          </span>
        </nuxt-link>
      </div>
    </div>

    <div class="w-1/12">
      <div class="h-[50px] flex items-center">
        <EventTag
          :interaction="interaction"
          :interaction-name="interactionName"
        />
      </div>
    </div>

    <div class="flex-1 is-ellipsis">
      <div class="h-[50px] flex items-center">
        <div
          v-if="parseInt(trade.price)"
          class="flex gap-2 items-center"
        >
          <span>{{ amount }}</span> <span class="text-k-grey text-sm">({{ price }})</span>
        </div>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>

    <div
      class="flex-1"
    >
      <div class="h-[50px] flex items-center gap-2">
        <ProfileAvatar
          :size="24"
          :address="targetAddress"
        />

        <nuxt-link
          :to="`/${urlPrefix}/u/${targetAddress}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <IdentityIndex
            :address="targetAddress"
          />
        </nuxt-link>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <template v-if="trade.expirationDate">
          <div v-if="isExpired">
            <span>{{ $t('expired') }}</span>
          </div>
          <div v-else>
            <span>{{ format(trade.expirationDate, EXPIRATION_FORMAT) }}</span>
            <span class="text-k-grey ml-3">({{ formatToNow(trade.expirationDate, isExpired) }})</span>
          </div>
        </template>
        <span v-else>
          {{ blank }}
        </span>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <TradeOwnerButton
          class="max-md:!w-full"
          :trade="trade"
          @click="$emit('select')"
        />
      </div>
    </div>
  </div>
  <!-- Mobile -->
  <div
    v-else
    class="mb-6 flex flex-col"
  >
    <div class="flex flex-col gap-[10px]">
      <div class="flex h-[70px] leading-[1]">
        <nuxt-link :to="`/${urlPrefix}/gallery/${trade.desired.id}`">
          <div class="mr-5">
            <BaseMediaItem
              class="border border-k-shade w-[4.375rem] h-[4.375rem]"
              alt="offer.Item.name"
              :src="image"
              :animation-src="!image ? animationUrl : undefined"
              preview
              is-detail
            />
          </div>
        </nuxt-link>
        <div class="flex flex-col justify-center gap-[10px] flex-grow">
          <nuxt-link
            class="is-ellipsis inline-block w-60"
            :to="`/${urlPrefix}/gallery/${trade.desired.id}`"
          >
            <span class="font-bold">
              {{ trade.desired.name }}
            </span>
          </nuxt-link>

          <EventTag
            :interaction="interaction"
            :interaction-name="interactionName"
          />
        </div>
      </div>

      <div
        v-if="parseInt(trade.price)"
        class="flex gap-2 items-center"
      >
        <span>{{ amount }}</span> <span class="text-k-grey text-sm">({{ price }})</span>
      </div>
      <div v-else>
        {{ blank }}
      </div>
      <template v-if="trade.expirationDate">
        <div v-if="isExpired">
          <span>{{ $t('expired') }}</span>
        </div>
        <div v-else>
          <span>{{ format(trade.expirationDate, EXPIRATION_FORMAT) }}</span>
          <span class="text-k-grey ml-3">({{ formatToNow(trade.expirationDate, isExpired) }})</span>
        </div>
      </template>
      <span v-else>
        {{ blank }}
      </span>

      <div class="flex gap-4">
        <div
          class="flex items-center"
        >
          <span class="text-xs mr-3">{{ $t(`activity.event.${target}`) }}:</span>
          <div class="flex items-center gap-2">
            <ProfileAvatar
              :size="24"
              :address="targetAddress"
            />
            <nuxt-link
              :to="`/${urlPrefix}/u/${targetAddress}`"
              class="text-k-blue hover:text-k-blue-hover"
            >
              <IdentityIndex
                :address="targetAddress"
              />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <TradeOwnerButton
      class="max-md:!w-full !mt-4"
      :trade="trade"
      @click="$emit('select')"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { formatToNow } from '@/utils/format/time'
import {
  blank,
  interactionNameMap,
} from '@/components/collection/activity/events/eventRow/common'
import EventTag from '@/components/collection/activity/events/eventRow/EventTag.vue'
import { TradeInteraction } from '@/composables/collectionActivity/types'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'

const EXPIRATION_FORMAT = 'dd.MM. HH:MM'

defineEmits(['select'])
const props = defineProps<{
  trade: TradeNftItem
  variant: ResponsiveVariant
  target: 'from' | 'to'
}>()

const interaction = {
  [TradeType.OFFER]: TradeInteraction.OFFER,
  [TradeType.SWAP]: TradeInteraction.SWAP,
}[props.trade.type]

const { urlPrefix } = usePrefix()
const { format: formatPrice } = useFormatAmount()
const { amount, price } = formatPrice(props.trade?.price)

const image = ref()
const animationUrl = ref()

const isDesktop = computed(() => props.variant === 'Desktop')
const isExpired = computed(() => props.trade.status === 'EXPIRED')
const targetAddress = computed(() => props.target === 'to' ? props.trade.desired.currentOwner : props.trade.caller)
const interactionName = computed(() => interactionNameMap()[interaction])

const getAvatar = async (nft) => {
  const meta = await getNftMetadata(nft)
  image.value = meta.image
  animationUrl.value = meta.animationUrl
}

// TODO imporve nft fetching
onBeforeMount(() => fetchNft(props.trade.desired.id).then(getAvatar))
</script>
