<template>
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
        class="!w-[80px]"
        width="80px"
        border-radius="10px"
        height="20px"
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
                class="text-k-grey opacity-20"
                icon="circle"
                pack="fass"
                size="small"
              />
              <div class="flex items-center gap-2 text-sm truncate">
                <Money
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
              </div>
            </div>
            <span class="text-k-grey text-sm">
              {{ formatDistanceToNow(trade.updatedAt) }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex items-center space-between ">
      <div class="text-sm flex gap-2">
        <span class="text-k-grey"> Count: </span>
        <span> {{ trades.length }} </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoButton, NeoSkeleton } from '@kodadot1/brick'
import { TradeType } from '@/composables/useTrades'
import { formatDistanceToNow } from '@/utils/datetime'

const tradeTypes = [
  TradeType.OFFER,
  TradeType.SWAP,
]

const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const trades = ref<TradeNftItem[]>([])

const { data: ownedCollections, pending: loadingOwnedCollections } = useOwnedCollections(accountId)

const disabledTrades = computed(() => loadingOwnedCollections.value)
const where = computed(() => buildIncomingTradesQuery(accountId.value, ownedCollections.value?.map(({ id }) => id) || []))

const loadings = ref<boolean[]>([])
const loading = computed(() => loadings.value.some(Boolean))
const refetches = ref<ReturnType<typeof useTrades>['refetch'][]>([])

const startLoading = () => {
  loadings.value = new Array(tradeTypes.length).fill(true)
}

const refetch = async () => {
  startLoading()
  trades.value = []
  await Promise.all(refetches.value.map(refetch => refetch()))
}

const init = () => {
  startLoading()

  tradeTypes.forEach((tradeType, index) => {
    const { items, loading: tradeLoading, refetch } = useTrades({
      where: where,
      disabled: disabledTrades,
      limit: 2,
      type: tradeType,
      disableTargetsOfTrades: true,
      orderBy: ['blockNumber_ASC'],
    })

    refetches.value[index] = refetch

    watch(tradeLoading, (isLoading) => {
      if (!isLoading) {
        trades.value = [...trades.value, ...items.value]
        loadings.value[index] = false
      }
    }, { immediate: true })
  })
}

init()
</script>
