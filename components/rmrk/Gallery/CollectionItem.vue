<template>
  <section>
    <div class="columns is-centered">
      <div class="column is-half has-text-centered">
        <div class="container image is-128x128 mb-2">
          <BasicImage
            :src="image"
            :alt="name"
            rounded
            customClass="collection__image" />
        </div>
        <h1 class="title is-2">
          {{ name }}
        </h1>
      </div>
    </div>

    <div class="columns is-align-items-center">
      <div class="column">
        <div>
          <div class="label">
            {{ $t('creator') }}
          </div>
          <div v-if="issuer" class="subtitle is-size-6">
            <ProfileLink :address="issuer" inline showTwitter showDiscord />
            <p v-if="showMintTime" class="is-flex is-align-items-center py-3">
              <b-icon icon="clock" size="is-medium" />
              <span class="ml-2">Started minting {{ formattedTimeToNow }}</span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="id" class="column is-6-tablet is-7-desktop is-8-widescreen">
        <CollectionActivity :id="id" />
      </div>

      <div class="column has-text-right">
        <Sharing
          v-if="sharingVisible"
          class="mb-2"
          :label="name"
          :iframe="iframeSettings">
          <DonationButton :address="issuer" />
        </Sharing>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-8 has-text-centered">
        <DescriptionWrapper
          v-if="!isLoading"
          :rowHeight="50"
          :text="description.replaceAll('\n', '  \n')" />
      </div>
    </div>

    <b-tabs
      position="is-centered"
      v-model="activeTab"
      ref="tabsContainer"
      :style="{ minHeight: '800px' }"
      class="tabs-container-mobile">
      <b-tab-item label="Items" value="items">
        <Search
          v-bind.sync="searchQuery"
          :showOwnerSwitch="!!accountId"
          :disableToggle="!totalListed"
          :sortOption="collectionProfileSortOption">
          <Layout class="mr-5" />
          <b-field>
            <Pagination
              hasMagicBtn
              simple
              replace
              preserveScroll
              :total="total"
              v-model="currentValue"
              v-if="activeTab === 'items'"
              :per-page="first" />
          </b-field>
        </Search>

        <InfiniteLoading
          v-if="startPage > 1 && !isLoading && total > 0"
          direction="top"
          @infinite="reachTopHandler"></InfiniteLoading>
        <GalleryCardList
          :items="nfts"
          :listed="!!(searchQuery && searchQuery.listed)"
          horizontalLayout />
        <InfiniteLoading
          v-if="canLoadNextPage && !isLoading && total > 0"
          @infinite="reachBottomHandler"></InfiniteLoading>
        <ScrollTopButton />
      </b-tab-item>
      <b-tab-item label="Chart" value="chart">
        <CollectionPriceChart :priceData="priceData" />
      </b-tab-item>
      <b-tab-item label="History" value="history">
        <History
          v-if="!isLoading && activeTab === 'history'"
          :events="eventsOfNftCollection"
          :openOnDefault="isHistoryOpen"
          hideCollapse
          @setPriceChartData="setPriceChartData" />
      </b-tab-item>
      <b-tab-item label="Holders" value="holders">
        <CommonHolderTable
          v-if="!isLoading && activeTab === 'holders'"
          :events="ownerEventsOfNftCollection"
          :openOnDefault="isHolderOpen"
          hideCollapse />
      </b-tab-item>
      <b-tab-item label="Flippers" value="flippers">
        <Flipper
          v-if="!isLoading && activeTab === 'flippers'"
          :events="ownerEventsOfNftCollection"
          openOnDefault
          hideCollapse />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import { emptyObject } from '@/utils/empty'
import { Component, mixins, Watch, Ref } from 'nuxt-property-decorator'
import { CollectionWithMeta, Interaction } from '../service/scheme'
import {
  sanitizeIpfsUrl,
  fetchCollectionMetadata,
  onlyPriceEvents,
} from '../utils'
import isShareMode from '@/utils/isShareMode'
import shouldUpdate from '@/utils/shouldUpdate'
import collectionById from '@/queries/collectionById.graphql'
import collectionChartById from '@/queries/rmrk/subsquid/collectionChartById.graphql'
import { CollectionMetadata } from '../types'
import { NFT } from '@/components/rmrk/service/scheme'
import { exist } from '@/components/rmrk/Gallery/Search/exist'
import { SearchQuery } from './Search/types'
import ChainMixin from '@/utils/mixins/chainMixin'
import AuthMixin from '~/utils/mixins/authMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { getCloudflareImageLinks } from '~/utils/cachingStrategy'
import { mapOnlyMetadata } from '~/utils/mappers'
import CreatedAtMixin from '@/utils/mixins/createdAtMixin'
import InfiniteScrollMixin from '~/utils/mixins/infiniteScrollMixin'
import { CollectionChartData as ChartData } from '@/utils/chart'
import { mapDecimals } from '@/utils/mappers'
import { notificationTypes, showNotification } from '@/utils/notification'
import allCollectionSaleEvents from '@/queries/rmrk/subsquid/allCollectionSaleEvents.graphql'
import { sortedEventByDate } from '~/utils/sorting'
import { Debounce } from 'vue-debounce-decorator'

const tabsWithCollectionEvents = ['history', 'holders', 'flippers']

const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  CollectionActivity: () =>
    import('@/components/rmrk/Gallery/CollectionActivity.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  Search: () => import('./Search/SearchBarCollection.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  DonationButton: () => import('@/components/transfer/DonationButton.vue'),
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
  CollectionPriceChart: () =>
    import('@/components/rmrk/Gallery/CollectionPriceChart.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  DescriptionWrapper: () =>
    import('@/components/shared/collapse/DescriptionWrapper.vue'),
  History: () => import('@/components/rmrk/Gallery/History.vue'),
  CommonHolderTable: () =>
    import('@/components/rmrk/Gallery/Holder/Holder.vue'),
  Flipper: () => import('@/components/rmrk/Gallery/Flipper.vue'),
  InfiniteLoading: () => import('vue-infinite-loading'),
  ScrollTopButton: () => import('@/components/shared/ScrollTopButton.vue'),
}
@Component<CollectionItem>({
  components,
})
export default class CollectionItem extends mixins(
  ChainMixin,
  PrefixMixin,
  CreatedAtMixin,
  InfiniteScrollMixin,
  AuthMixin
) {
  @Ref('tabsContainer') readonly tabsContainer
  private id = ''
  private collection: CollectionWithMeta = emptyObject<CollectionWithMeta>()
  public meta: CollectionMetadata = emptyObject<CollectionMetadata>()
  private searchQuery: SearchQuery = Object.assign(
    {
      search: '',
      type: '',
      sortBy: (this.$route.query.sort as string) ?? 'BLOCK_NUMBER_DESC',
      listed: false,
      owned: null,
    },
    this.$route.query
  )
  public activeTab = 'items'
  protected first = 16
  protected totalListed = 0
  protected stats: NFT[] = []
  protected priceData: [ChartData[], ChartData[]] | [] = []
  private queryLoading = 0
  public eventsOfNftCollection: Interaction[] | [] = []
  public ownerEventsOfNftCollection: Interaction[] | [] = []
  public selectedEvent = 'all'
  public priceChartData: [Date, number][][] = []
  private openHistory = true
  private openHolder = true
  private isLoading = true
  private nfts: NFT[] = []

  collectionProfileSortOption: string[] = [
    'EMOTES_COUNT_DESC',
    'BLOCK_NUMBER_DESC',
    'BLOCK_NUMBER_ASC',
    'UPDATED_AT_DESC',
    'UPDATED_AT_ASC',
    'PRICE_DESC',
    'PRICE_ASC',
    'SN_ASC',
  ]

  get hasChartData(): boolean {
    return this.priceData.length > 0
  }

  get image(): string | undefined {
    return this.meta.image
  }

  get description(): string {
    return this.meta.description || ''
  }

  get name(): string {
    return this.collection.name || this.id
  }

  get isHistoryOpen(): boolean {
    return this.openHistory
  }

  get isHolderOpen(): boolean {
    return this.openHolder
  }

  get issuer(): string {
    return this.collection.issuer || ''
  }

  get sharingVisible(): boolean {
    return !isShareMode
  }

  get compactCollection(): boolean {
    return this.$store.getters['preferences/getCompactCollection']
  }

  get showMintTime(): boolean {
    return this.$store.state.preferences.showMintTimeCollection
  }

  set currentValue(page: number) {
    this.gotoPage(page)
  }

  get currentValue() {
    return this.currentPage
  }

  private buildSearchParam(checkForEmpty?): Record<string, unknown>[] {
    const params: any[] = []

    if (this.searchQuery.search) {
      params.push({
        name: { likeInsensitive: `%${this.searchQuery.search}%` },
      })
    }

    if (this.searchQuery.listed || checkForEmpty) {
      params.push({
        price: { greaterThan: '0' },
      })
    }

    if (this.searchQuery.owned && this.accountId) {
      params.push({
        currentOwner: { equalTo: this.accountId },
      })
    }

    return params
  }

  public created(): void {
    this.checkId()
    this.checkActiveTab()
    this.checkIfEmptyListed()
    this.fetchPageData(this.startPage)
  }

  public async fetchPageData(page: number, loadDirection = 'down') {
    if (this.isFetchingData) {
      return false
    }
    this.isFetchingData = true
    const result = await this.$apollo.query({
      query: collectionById,
      client: this.urlPrefix,
      variables: {
        id: this.id,
        orderBy: this.searchQuery.sortBy,
        search: this.buildSearchParam(),
        first: this.first,
        offset: (page - 1) * this.first,
      },
    })
    await this.handleResult(result, loadDirection)
    this.isFetchingData = false
    return true
  }

  @Debounce(500)
  private resetPage() {
    this.gotoPage(1)
  }

  protected gotoPage(page: number) {
    this.currentPage = page
    this.startPage = page
    this.endPage = page
    this.nfts = []
    this.isLoading = true
    this.isFetchingData = false
    this.fetchPageData(page)
  }

  public async checkIfEmptyListed(): Promise<void> {
    // if the collection is empty, we need to check if there are any listed NFTs
    this.$apollo.addSmartQuery('totalListed', {
      query: collectionById,
      client: this.urlPrefix,
      update: (data) => {
        return data.collectionEntity.nfts.totalCount
      },
      variables: () => {
        return {
          id: this.id,
          orderBy: this.searchQuery.sortBy,
          search: this.buildSearchParam(true),
          first: this.first,
          offset: this.offset,
        }
      },
    })
  }
  public setPriceChartData(data: [Date, number][][]) {
    this.priceChartData = data
  }

  protected async loadStats(): Promise<void> {
    const { data } = await this.$apollo.query<{
      buys: ChartData[]
      listings: ChartData[]
    }>({
      query: collectionChartById,
      client: 'subsquid',
      variables: {
        id: this.id,
      },
    })

    if (!data) {
      return
    }
    // this.$consola.log(data.collection.nfts.nodes)

    // const events: Interaction[][] =
    //   data.collection.nfts.nodes.map((nft) => nft.events) || []

    this.loadPriceData(data)
    this.checkTabLocate()
  }

  // Get collection query with NFT Events on it
  protected async fetchCollectionEvents() {
    try {
      const { data } = await this.$apollo.query<{ events: Interaction[] }>({
        query: allCollectionSaleEvents,
        client: 'subsquid',
        variables: {
          id: this.id,
          and: {
            // interaction_eq: 'BUY',
          },
        },
      })
      if (data && data.events && data.events.length) {
        let events: Interaction[] = data.events
        // TODO : default value of HISTORY for BUY
        // Check if lot of BUY Events, default selectedEvent of History.vue to "BUY"
        this.eventsOfNftCollection = [...sortedEventByDate(events, 'DESC')]
        // copy array and reverse
        this.ownerEventsOfNftCollection = [
          ...this.eventsOfNftCollection,
        ].reverse()
        this.checkTabLocate()
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  public loadPriceData({
    buys,
    listings,
  }: {
    buys: ChartData[]
    listings: ChartData[]
  }): void {
    this.priceData = []

    const mapToDecimals = mapDecimals(this.decimals, false)
    const soldPriceData = buys.map((buy) => ({
      ...buy,
      value: mapToDecimals(buy.value),
      average: mapToDecimals(buy.average || 0),
    }))

    const listedPriceData = listings.map((listing) => ({
      ...listing,
      value: mapToDecimals(listing.value),
    }))

    this.priceData = [listedPriceData, soldPriceData]
  }

  public async handleResult(
    { data }: any,
    loadDirection = 'down'
  ): Promise<void> {
    const { collectionEntity } = data
    if (!collectionEntity) {
      return this.$nuxt.error({
        statusCode: 404,
        message: 'Oops! Collection Not Found',
        path: this.$route.path,
      })
    }
    this.firstMintDate = collectionEntity.createdAt
    const newNfts = collectionEntity.nfts.nodes.map((e: any) => ({
      ...e,
      emoteCount: e?.emotes?.totalCount,
    }))

    await getCloudflareImageLinks(newNfts.map(mapOnlyMetadata)).catch(
      this.$consola.warn
    )
    this.collection = {
      ...collectionEntity,
      nfts: newNfts,
    }
    if (loadDirection === 'up') {
      this.nfts = newNfts.concat(this.nfts)
    } else {
      this.nfts = this.nfts.concat(newNfts)
    }
    this.total = collectionEntity.nfts.totalCount
    this.isLoading = false

    await this.fetchMetadata()
  }

  public async fetchMetadata(): Promise<void> {
    if (this.collection['metadata'] && !this.meta['image']) {
      const meta = await fetchCollectionMetadata(this.collection)
      this.meta = {
        ...meta,
        image: sanitizeIpfsUrl(meta.image || ''),
      }
      this.$store.dispatch('history/setCurrentlyViewedCollection', {
        name: this.name,
        image: this.image,
        description: this.description,
        numberOfItems: this.total || 0,
      })
    }
  }

  public checkId(): void {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
  }

  public checkActiveTab(): void {
    exist(this.$route.query.tab, (val) => {
      this.activeTab = val
    })
  }

  checkTabLocate() {
    exist(this.$route.query.locate, (val) => {
      if (val !== 'true') {
        return
      }
      this.tabsContainer.$el.scrollIntoView()
      this.$router.replace({
        query: { ...this.$route.query, ['locate']: 'false' },
      })
    })
  }

  @Watch('searchQuery', { deep: true })
  protected onSearchQueryChange() {
    this.resetPage()
  }

  @Watch('activeTab')
  protected onTabChange(val: string, oldVal: string): void {
    let queryTab = this.$route.query.tab

    if (shouldUpdate(val, oldVal) && queryTab !== val) {
      this.$router.replace({
        path: String(this.$route.path),
        query: { tab: val },
      })
    }

    // Load chart data once when clicked on activity tab for the first time.
    if (val === 'chart') {
      this.loadStats()
    } else if (tabsWithCollectionEvents.includes(val)) {
      this.fetchCollectionEvents()
    }
  }

  get iframeSettings(): Record<string, unknown> {
    return { width: '100%', height: '100vh' }
  }

  protected priceEvents(nftEvents: Interaction[]): Interaction[] {
    return nftEvents.filter(onlyPriceEvents)
  }
}
</script>

<style lang="scss">
.collection__image img {
  border-radius: 0px;
  color: transparent;
}
</style>
