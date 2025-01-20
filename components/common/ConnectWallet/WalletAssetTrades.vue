<template>
  <div class="wallet-asset-container">
    <div
      v-if="loading"
      class="flex flex-col gap-4"
    >
      <NeoSkeleton
        no-margin
        height="123px"
      />

      <div class="flex items-center justify-between">
        <NeoSkeleton
          no-margin
          width="60px"
          class="!w-[60px]"
          height="14px"
        />
        <NeoSkeleton
          no-margin
          class="!w-[99px]"
          width="99px"
          border-radius="10px"
          height="24px"
        />
      </div>
    </div>
    <div
      v-else-if="trades.length"
      class="flex flex-col gap-4"
    >
      <div
        class="border border-border-color rounded-lg !p-4 w-full"
      >
        <div class="flex justify-between items-center">
          <p class="capitalize">
            {{ $t('trades.incomingTrades') }}
          </p>

          <NeoButton
            variant="icon"
            @click="refetch"
          >
            <NeoIcon
              icon="refresh"
            />
          </NeoButton>
        </div>

        <hr class="my-3">

        <div class="flex flex-col gap-2">
          <ul>
            <li
              v-for="trade in trades.slice(0, 2)"
              :key="trade.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <NeoIcon
                  class="text-k-grey opacity-20 !text-[0.4rem]"
                  icon="circle"
                  pack="fass"
                  size="small"
                />
                <div class="flex items-center gap-2 text-sm truncate">
                  <nuxt-link
                    v-if="trade.type === TradeType.SWAP"
                    :to="`${urlPrefix}/gallery/${trade.offered.id}`"
                  >
                    <span>
                      {{ trade.offered.name }}
                    </span>
                  </nuxt-link>
                  <Money
                    v-else
                    :value="trade.price"
                    inline
                  />

                  <span class="text-k-grey capitalize">
                    {{ $t('for') }}
                  </span>

                  <nuxt-link
                    v-if="trade.desired"
                    :to="`${urlPrefix}/gallery/${trade.desired.id}`"
                  >
                    <span>
                      {{ trade.desired.name }}
                    </span>
                  </nuxt-link>
                  <nuxt-link
                    v-else
                    :to="`${urlPrefix}/collection/${trade.considered.id}`"
                  >
                    <span>
                      {{ trade.considered.name }}
                    </span>
                  </nuxt-link>
                </div>
              </div>
              <span class="text-k-grey text-sm">
                {{ formatDistanceToNow(trade.createdAt) }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm flex gap-2">
          <span class="text-k-grey">
            {{ $t('count') }}:
          </span>
          <span> {{ trades.length }} </span>
        </div>

        <NeoButton
          variant="pill"
          size="small"
          class="px-4 py-1"
          icon="arrow-right"
          @click="viewAll"
        >
          {{ $t('helper.viewAll') }}
        </NeoButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoButton, NeoSkeleton } from '@kodadot1/brick'
import { TradeType, type TradeNftItem } from '@/components/trade/types'
import { TRADE_TYPE_TO_PROFILE_TAB_MAP } from '@/components/profile/utils'
import { formatDistanceToNow } from '@/utils/datetime'

const tradeTypes = [
  TradeType.OFFER,
  TradeType.SWAP,
]

const trades = ref<TradeNftItem[]>([])
const loadings = ref<boolean[]>([])
const refetches = ref<ReturnType<typeof useTrades>['refetch'][]>([])

const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const { data: ownedCollections, isFetching, isPending } = useOwnedCollections(accountId)

const loadingOwnedCollections = computed(() => isPending.value || isFetching.value)
const disabledTrades = computed(() => loadingOwnedCollections.value)
const where = computed(() => buildIncomingTradesQuery(accountId.value, ownedCollections.value?.map(({ id }) => id) || []))
const loading = computed(() => loadings.value.some(Boolean) || loadingOwnedCollections.value)

const clear = () => {
  loadings.value = new Array(tradeTypes.length).fill(true)
  trades.value = []
}

const refetch = async () => {
  clear()
  await Promise.all(refetches.value.map(refetch => refetch()))
}

const getTradeTypeWithMoreIncomingTrades = (): TradeType | null => {
  const groups = Object.groupBy(trades.value, item => item.type)

  const swapLength = groups[TradeType.SWAP]?.length || 0
  const offerLength = groups[TradeType.OFFER]?.length || 0

  if (swapLength == offerLength) {
    return null
  }

  return (swapLength > offerLength)
    ? TradeType.SWAP
    : TradeType.OFFER
}

const viewAll = () => {
  const tab = TRADE_TYPE_TO_PROFILE_TAB_MAP[getTradeTypeWithMoreIncomingTrades() || trades.value[0].type]

  navigateTo(`/${urlPrefix.value}/u/${accountId.value}?tab=${tab}&filter=incoming`)
}

const init = () => {
  clear()

  tradeTypes.forEach((tradeType, index) => {
    const { items, loading: tradeLoading, refetch } = useTrades({
      where: where,
      disabled: disabledTrades,
      type: tradeType,
      minimal: true,
    })

    refetches.value[index] = refetch

    watch([tradeLoading, items], ([isLoading, items]) => {
      if (!isLoading) {
        trades.value = [...trades.value, ...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        loadings.value[index] = false
      }
    }, { immediate: true })
  })
}

onBeforeMount(init)
</script>
