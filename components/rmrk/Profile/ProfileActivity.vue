<template>
  <div>
    <div v-if="stats" class="level my-4 collection is-align-items-center">
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ listedCount }} ⊆ {{ totalSoldItems }}</p>
          <p class="heading">
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
          </p>
          <p class="title">
            <CommonTokenMoney :value="totalAmountSpend" inline />
          </p>
          <p class="heading">
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
          <p class="heading">
            {{ $t('profileStats.totalHoldingsBoughtValues') }}
          </p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <CommonTokenMoney :value="maxSoldPrice" inline /> ⊆
            <CommonTokenMoney :value="totalSell" inline />
          </p>
          <p class="heading">
            {{ $t('profileStats.maxSoldPrice') }} /
            {{ $t('profileStats.totalSellValues') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { getSum, getSumOfObjectField } from '@/utils/math'
import { subDays } from 'date-fns'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { Event } from '../service/types'
import resolveQueryPath from '~/utils/queryPathResolver'

const components = {
  CommonTokenMoney: () => import('@/components/shared/CommonTokenMoney.vue'),
  StatsColumn: () => import('@/components/shared/format/StatsColumn.vue'),
}
type Stats = {
  listedCount: number
  totalCollected: number
}

@Component({ components })
export default class ProfileActivity extends mixins(PrefixMixin) {
  @Prop({ type: String, required: true }) public id!: string
  public yesterdayDate: Date = subDays(Date.now(), 1)
  protected profileStats = {
    totalBuys: 'profileStats.totalBuys',
    holdingsNfts: 'profileStats.holdingsNfts',
    totalHoldingsBoughtValues: 'profileStats.totalHoldingsBoughtValues',
  }

  protected stats: Stats = {
    listedCount: 0,
    totalCollected: 0,
  }
  totalPurchases = 0
  highestBuyPrice = 0
  maxSoldPrice = 0
  totalSoldItems = 0
  totalHoldingsBoughtValues: bigint | number = BigInt(0)
  totalAmountSpend: bigint | number = 0
  totalSell: bigint | number = BigInt(0)

  totalGiftItems = 0

  async fetch() {
    if (!this.id) {
      this.$consola.warn('ProfilActivity: id is not defined')
      return
    }

    const query = await resolveQueryPath(this.client, 'profileStatsById')
    const { data } = await this.$apollo.query({
      query: query.default,
      client: this.client,
      variables: {
        id: this.id,
      },
    })

    if (!data) {
      this.$consola.log('stats is null')
      return
    }

    this.stats = {
      listedCount: data.listed.totalCount,
      totalCollected: data.obtained.totalCount,
    }

    this.getSellerEvents(data)
    this.getInvestorStatsEvents(data)
  }

  get totalCollected(): number {
    return this.stats.totalCollected
  }

  get listedCount(): number {
    return this.stats.listedCount
  }

  get totalHoldingsNfts(): number {
    return this.stats.totalCollected
  }

  protected differentOwner(nft: {
    issuer: string
    currentOwner: string
  }): boolean {
    return nft.currentOwner !== nft.issuer
  }

  // Collector stats
  // Invested and Spend Statistics
  // protected getInvestorStatsEvents(investedEvents: Event[]) {
  protected getInvestorStatsEvents(data: any) {
    const investedEvents: Event[] = data.invested
    const maxPriceInvested = Math.max(
      ...investedEvents.map((n: Event) => {
        return parseInt(n.meta)
      })
    )
    this.highestBuyPrice = maxPriceInvested
    this.totalPurchases = investedEvents.length

    const holdingsEvents = investedEvents.filter(
      (x) => x.nft.currentOwner == this.id
    )

    this.totalAmountSpend = getSumOfObjectField(investedEvents, 'meta')
    // Amount spend for holding this nft in the wallet
    this.totalHoldingsBoughtValues = getSumOfObjectField(holdingsEvents, 'meta')
  }

  // Sellor stats
  // Check all SEND events, and get the List event for keep the price with e.meta
  protected getSellerEvents(data: any) {
    const soldEvents: Event[] = []
    data.sold.edges.forEach((e: any) => {
      if (e.node && e.node.events && e.node.events.length > 0) {
        e.node.events.forEach((e: Event) => {
          if (BigInt(e.meta)) {
            soldEvents.push(e)
          }
        })
      }
    })

    this.totalSoldItems = data.sold.totalCount
    const allValuesList = soldEvents.map((e) => parseFloat(e.meta))
    const maxPriceSold = Math.max(...allValuesList, 0)
    // Highest Buy and Total amount sell
    this.maxSoldPrice = maxPriceSold
    this.totalSell = getSum(allValuesList)
  }
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
