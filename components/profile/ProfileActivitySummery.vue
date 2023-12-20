<template>
  <div>
    <div v-if="stats" class="level my-4 collection items-center">
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ listedCount }} ⊆ {{ totalSoldItems }}</p>
          <p class="is-size-7 has-text-grey">
            {{ $t('profileStats.listed') }} /
            {{ $t('profileStats.totalSoldItems') }}
          </p>
        </div>
      </div>

      <StatsColumn
        :value="totalHoldingsNfts"
        :header="profileStats.holdingsNfts"
        inline />

      <StatsColumn
        :value="totalPurchases"
        :header="profileStats.totalBuys"
        inline />

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <CommonTokenMoney :value="highestBuyPrice" inline /> ⊆
            <CommonTokenMoney :value="totalAmountSpend" inline />
          </p>
          <p class="is-size-7 has-text-grey">
            {{ $t('profileStats.highestBuy') }} /
            {{ $t('profileStats.totalAmountSpend') }}
          </p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <CommonTokenMoney :value="totalHoldingsBoughtValues" inline /> ⊆
          </p>
          <p class="is-size-7 has-text-grey">
            {{ chainSymbol }} {{ $t('profileStats.totalHoldingsBoughtValues') }}
          </p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <CommonTokenMoney :value="maxSoldPrice" inline /> ⊆
            <CommonTokenMoney :value="totalSell" inline />
          </p>
          <p class="is-size-7 has-text-grey">
            {{ $t('profileStats.maxSoldPrice') }} /
            {{ $t('profileStats.totalSellValues') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getSum, getSumOfObjectField } from '@/utils/math'
import resolveQueryPath from '@/utils/queryPathResolver'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import StatsColumn from '@/components/shared/format/StatsColumn.vue'
import { Event } from '@/components/rmrk/service/types'
import { getDenyList } from '@/utils/prefix'

type Stats = {
  listedCount: number
  totalCollected: number
}

const props = defineProps({
  id: { type: String, default: '' },
})

const { $consola } = useNuxtApp()
const { client, urlPrefix } = usePrefix()
const { chainSymbol } = useDeposit(urlPrefix)

const profileStats = ref({
  totalBuys: 'profileStats.totalBuys',
  holdingsNfts: 'profileStats.holdingsNfts',
  totalHoldingsBoughtValues: 'profileStats.totalHoldingsBoughtValues',
})
const stats = ref<Stats>({
  listedCount: 0,
  totalCollected: 0,
})
const totalPurchases = ref(0)
const highestBuyPrice = ref(0)
const maxSoldPrice = ref(0)
const totalSoldItems = ref(0)
const totalHoldingsBoughtValues = ref<bigint | number>(BigInt(0))
const totalAmountSpend = ref<bigint | number>(0)
const totalSell = ref<bigint | number>(BigInt(0))

const totalHoldingsNfts = computed(() => stats.value.totalCollected)
const listedCount = computed(() => stats.value.listedCount)

useLazyAsyncData('stats', async () => {
  if (!props.id) {
    $consola.warn('ProfilActivity: id is not defined')
    return
  }

  const query = await resolveQueryPath(client.value, 'profileStatsById')
  const { data } = await useAsyncQuery({
    query: query.default,
    clientId: client.value,
    variables: {
      id: props.id,
      denyList: getDenyList(urlPrefix.value),
    },
  })

  if (!data.value) {
    $consola.log('stats is null')
    return
  }

  stats.value = {
    listedCount: data.value?.listed.totalCount,
    totalCollected: data.value?.obtained.totalCount,
  }

  getSellerEvents(data.value)
  getInvestorStatsEvents(data.value)
})

// Collector stats: Invested and Spend Statistics
const getInvestorStatsEvents = (data: any) => {
  const investedEvents: Event[] = data.invested
  const maxPriceInvested = Math.max(
    ...investedEvents.map((n: Event) => {
      return parseInt(n.meta)
    }),
  )
  highestBuyPrice.value = maxPriceInvested
  totalPurchases.value = investedEvents.length

  const holdingsEvents = investedEvents.filter(
    (x) => x.nft.currentOwner == props.id,
  )

  totalAmountSpend.value = getSumOfObjectField(investedEvents, 'meta')
  // Amount spend for holding this nft in the wallet
  totalHoldingsBoughtValues.value = getSumOfObjectField(holdingsEvents, 'meta')
}

// Sellor stats
// Check all SEND events, and get the List event for keep the price with e.meta
const getSellerEvents = (data: any) => {
  const soldEvents: Event[] = []
  data.sold.edges.forEach((e: any) => {
    if (e.node?.events && e.node.events.length > 0) {
      e.node.events.forEach((e: Event) => {
        if (BigInt(e.meta)) {
          soldEvents.push(e)
        }
      })
    }
  })

  totalSoldItems.value = data.sold.totalCount
  const allValuesList = soldEvents.map((e) => parseFloat(e.meta))
  const maxPriceSold = Math.max(...allValuesList, 0)
  // Highest Buy and Total amount sell
  maxSoldPrice.value = maxPriceSold
  totalSell.value = getSum(allValuesList)
}
</script>

<style lang="scss" scoped>
.collection {
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(3, 1fr);
}

.title {
  font-size: 1.2rem;
}
</style>
