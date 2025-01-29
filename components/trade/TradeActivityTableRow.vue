<template>
  <div
    v-if="isDesktop"
    class="flex gap-3 py-[.6rem]"
  >
    <div class="flex-1 overflow-hidden">
      <div class="flex items-center">
        <nuxt-link
          :to="itemPath"
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
          :to="itemPath"
        >
          <span class="ml-5 font-bold overflow-hidden">
            {{ item.name }}
          </span>
        </nuxt-link>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <div class="flex items-center">
        <nuxt-link
          :to="itemPath"
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
          :to="itemPath"
        >
          <span class="ml-5 font-bold overflow-hidden">
            {{ item.name }}
          </span>
        </nuxt-link>
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
        <NeoTag
          v-if="trade.isExpired"
          size="small"
        >
          <span>{{ $t('expired') }}</span>
        </NeoTag>
        <NeoTag
          v-else
          size="small"
        >
          <span>{{ $t('active') }}</span>
        </NeoTag>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <template v-if="trade.expirationDate && !trade.isExpired">
          <div>
            <span>{{ format(trade.expirationDate, EXPIRATION_FORMAT) }}</span>
            <span class="text-k-grey ml-3">({{ formatToNow(trade.expirationDate, trade.isExpired) }})</span>
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
          main-class="max-md:!w-full"
          detailed
          :trade="trade"
          @click:main="$emit('select')"
          @click:counter-swap="$emit('counter-swap')"
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
        <nuxt-link :to="itemPath">
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
            :to="itemPath"
          >
            <span class="font-bold">
              {{ item.name }}
            </span>
          </nuxt-link>
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
        <div v-if="trade.isExpired">
          <span>{{ $t('expired') }}</span>
        </div>
        <div v-else>
          <span>{{ format(trade.expirationDate, EXPIRATION_FORMAT) }}</span>
          <span class="text-k-grey ml-3">({{ formatToNow(trade.expirationDate, trade.isExpired) }})</span>
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
      class="mt-4"
      main-class="max-md:!w-full"
      detailed
      :trade="trade"
      @click:main="$emit('select')"
      @click:counter-swap="$emit('counter-swap')"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import NeoTag from '@/components/shared/gallery/NeoTag.vue'
import { formatToNow } from '@/utils/format/time'
import { blank } from '@/components/collection/activity/events/eventRow/common'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'

const EXPIRATION_FORMAT = 'dd.MM. HH:MM'

type Item = TradeToken | TradeConsidered

defineEmits(['select', 'counter-swap'])
const props = defineProps<{
  trade: TradeNftItem
  variant: ResponsiveVariant
  target: 'from' | 'to'
}>()

const getRowConfig = () => {
  return props.target === 'from'
    ? {
        item: props.trade.offered,
        desiredType: TradeDesiredType.TOKEN,
      }
    : {
        item: props.trade.isEntireCollectionDesired ? props.trade.considered : props.trade.desired as TradeToken,
        desiredType: props.trade.desiredType,
      }
}

const { urlPrefix } = usePrefix()
const { format: formatPrice } = useFormatAmount()
const { amount, price } = formatPrice(props.trade?.price)

const { item, desiredType } = getRowConfig()

const image = ref()
const animationUrl = ref()

const isDesktop = computed(() => props.variant === 'Desktop')

const isTradeCollection = computed(() => desiredType === TradeDesiredType.COLLECTION)
const itemPath = computed(() => isTradeCollection.value ? `/${urlPrefix.value}/collection/${item.id}` : `/${urlPrefix.value}/gallery/${item.id}`)

const targetAddress = computed(() => props.target === 'to' ? item.currentOwner : props.trade.caller)

const getAvatar = async (nft) => {
  const meta = await getNftMetadata(nft)
  image.value = meta.image
  animationUrl.value = meta.animationUrl
}

// TODO imporve nft fetching
onBeforeMount(() => {
  const fetchImageMap = {
    [TradeDesiredType.TOKEN]: (item: Item) => fetchNft(item.id).then(getAvatar),
    [TradeDesiredType.COLLECTION]: (item: Item) => image.value = sanitizeIpfsUrl(item.image),
  }

  fetchImageMap[desiredType]?.(item)
})
</script>
