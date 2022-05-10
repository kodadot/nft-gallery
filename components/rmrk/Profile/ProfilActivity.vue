<template>
  <div>
    <div class="level my-4 collection is-align-items-center" v-if="stats">
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ listedCount }} ⊆ {{ collectionLength }}</p>
          <p class="heading">
            {{ $t('profil_stats.listed') }} /
            {{ $t('profil_stats.totalItems') }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{ holdingsNft }}</p>
          <p class="heading">
            {{ $t('profil_stats.holdingsNfts') }}
          </p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="highestBuyPrice" inline /> ⊆
            {{ totalPurchases }}
          </p>
          <p class="heading">
            {{ $t('profil_stats.highestBuy') }} /
            {{ $t('profil_stats.totalBuys') }}
          </p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="totalAmountSpend" inline />
          </p>
          <p class="heading">
            {{ $t('profil_stats.totalAmountSpend') }}
          </p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="totalHoldingsBoughtValues" inline /> ⊆
          </p>
          <p class="heading">
            {{ $t('profil_stats.totalHoldingsBoughtValues') }}
          </p>
        </div>
      </div>

      <div class="level-item has-text-centered">
        <div>
          <p class="title">
            <Money :value="maxSoldPrice" inline /> ⊆
            <Money :value="totalSell" inline /> Σ
          </p>
          <p class="heading">
            {{ $t('profil_stats.maxSoldPrice') }} /
            {{ $t('profil_stats.totalSellValues') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { Interaction } from '@/components/rmrk/service/scheme'
import { pairListBuyEvent } from '@/utils/math'
import { subDays } from 'date-fns'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import profilStatsById from '@/queries/rmrk/subsquid/profilStatsById.graphql'
import { Event } from '../service/types'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
}
type Stats = {
  listedCount: number
  totalCollected: number
  collectionFloorPrice: number
  totalGiftItems: number
  gainsOfSoldItems: number
}

@Component({ components })
export default class ProfilActivity extends mixins(PrefixMixin) {
  @Prop({ type: String, required: true }) public id!: string
  public yesterdayDate: Date = subDays(Date.now(), 1)

  protected stats: Stats = {
    listedCount: 0,
    totalCollected: 0,
    collectionFloorPrice: 0,
    totalGiftItems: 0,
    gainsOfSoldItems: 0,
  }
  totalPurchases = 0
  totalAmountSpend = 0
  highestBuyPrice = 0
  maxSoldPrice = 0
  totalSell: BigInt = BigInt(0)
  totalSoldItems = 0
  totalHoldingsBoughtValues = 0

  async fetch() {
    if (!this.id) {
      this.$consola.warn('ProfilActivity: id is not defined')
      return
    }

    const { data } = await this.$apollo.query({
      query: profilStatsById,
      client: 'subsquid',
      variables: {
        id: this.id,
        search_sold: {
          interaction_eq: 'SEND',
          nft: { name_not_contains: '%Kanaria%', burned_eq: false },
        },
        search_listed: {
          interaction_eq: 'LIST',
          nft: {
            currentOwner_eq: this.id,
            name_not_contains: '%Kanaria%',
            burned_eq: false,
          },
        },
        search_collected: { currentOwner_eq: this.id },
        search_invested: {
          interaction_eq: 'BUY',
          nft: { name_not_contains: '%Kanaria%', burned_eq: false },
        },
      },
    })

    if (!data) {
      this.$consola.log('stats is null')
      return
    }
    const collectedEvents = data.collected
    const listedEvents = data.listed
    const investedEvents = data.invested
    // Collector stats
    // Invested and Spend Statistics
    const holdingsEvents = investedEvents.filter(
      (x) => x.nft.currentOwner == this.id
    )

    if (investedEvents.length > 0) {
      const maxPriceInvested = Math.max(
        ...investedEvents.map((n: Event, i: number) => {
          return n.meta
        })
      )
      this.totalPurchases = investedEvents.length
      // Amount spend for holding this nft in the wallet
      this.totalHoldingsBoughtValues = holdingsEvents
        .map((x) => BigInt(x.meta || 0))
        .reduce((acc, cur) => acc + cur, BigInt(0))
      this.totalAmountSpend = investedEvents
        .map((x) => BigInt(x.meta || 0))
        .reduce((acc, cur) => acc + cur, BigInt(0))
      this.highestBuyPrice = maxPriceInvested
    }

    const soldEvents: Interaction[] = []
    // Sellor stats
    // Check all SEND events, and get the List event for keep the price with e.meta
    data.sold.forEach((e: Event) => {
      if (e.nft && e.nft.events && e.nft.events.length > 0) {
        const buyEvents = pairListBuyEvent(
          e.nft.events as unknown as Interaction[]
        )
        buyEvents.forEach((ev) => {
          soldEvents.push(ev)
        })
      }
    })

    const allValuesList = soldEvents.map((e) => parseFloat(e.meta))
    const maxPriceSold = Math.max(...allValuesList)
    // Highest Buy and Total amount sell
    this.maxSoldPrice = maxPriceSold
    this.totalSell = allValuesList
      .map((x) => BigInt(x || 0))
      .reduce((acc, cur) => acc + cur, BigInt(0))

    this.stats = {
      listedCount: listedEvents.length - this.holdingsNft,
      totalCollected: collectedEvents.length,
      collectionFloorPrice: soldEvents.length,
      gainsOfSoldItems: soldEvents.length,
      totalGiftItems: soldEvents.length,
    }
  }

  get collectionLength(): number {
    return this.stats.totalCollected
  }

  get listedCount(): number {
    return this.stats.listedCount
  }

  get totalGiftItems(): number {
    return this.stats.totalGiftItems
  }

  get collectionFloorPrice(): number {
    return this.stats.collectionFloorPrice
  }

  get holdingsNft(): number {
    return this.stats.totalCollected - this.stats.listedCount
  }

  protected differentOwner(nft: {
    issuer: string
    currentOwner: string
  }): boolean {
    return nft.currentOwner !== nft.issuer
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.collection {
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(3, 1fr);
}

.title {
  font-size: 1.2rem;
}
</style>
