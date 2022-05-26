<template>
  <section>
    <div class="columns is-centered">
      <div class="column is-half has-text-centered">
        <div class="container image is-64x64 mb-2">
          <Avatar :value="id" />
        </div>
        <h1 class="title is-2">
          <a
            :href="`https://kusama.subscan.io/account/${id}`"
            target="_blank"
            rel="noopener noreferrer">
            <Identity
              ref="identity"
              :address="id"
              inline
              emit
              @change="handleIdentity" />
          </a>
        </h1>

        <nuxt-link v-if="!displayName && isMyProfile" to="/identity">
          + {{ $t('identity.set') }}
        </nuxt-link>
      </div>
    </div>

    <div class="columns is-mobile is-align-items-center">
      <div class="column">
        <div class="label">
          {{ $t('profile.user') }}
        </div>
        <div class="subtitle is-size-6">
          <ProfileLink :address="id" :inline="true" showTwitter showDiscord />
          <div class="ml-1 mt-2" v-if="myNftCount > 0">
            {{ $t('profile.collectedFromCreator', [myNftCount]) }}
          </div>
        </div>
      </div>
      <div class="column is-6-tablet is-7-desktop is-8-widescreen">
        <ProfileActivity :id="id" />
      </div>
      <div class="column has-text-right">
        <div class="is-flex is-justify-content-right">
          <div class="control" v-for="network in networks" :key="network.alt">
            <b-button class="share-button" type="is-primary is-bordered-light">
              <a
                :href="`${network.url}${id}`"
                target="_blank"
                rel="noopener noreferrer">
                <figure class="image is-24x24">
                  <img :alt="network.alt" :src="network.img" />
                </figure>
              </a>
            </b-button>
          </div>
        </div>
        <Sharing
          class="mb-2"
          v-if="!sharingVisible"
          :label="$t('sharing.profile')"
          :iframe="iframeSettings">
          <DonationButton :address="id" />
        </Sharing>
      </div>
    </div>

    <section>
      <b-tabs
        :class="{ 'invisible-tab': sharingVisible }"
        class="tabs-container-mobile"
        v-model="activeTab"
        destroy-on-hide
        expanded>
        <b-tab-item value="nft" :headerClass="{ 'is-hidden': !totalCreated }">
          <template #header>
            <b-tooltip
              :label="`${$t('tooltip.created')} ${labelDisplayName}`"
              append-to-body>
              {{ $t('profile.created') }}
              <span class="tab-counter">{{ totalCreated }}</span>
            </b-tooltip>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListByIssuer"
            @change="totalCreated = $event"
            :account="id"
            :showSearchBar="true" />
        </b-tab-item>
        <b-tab-item
          :label="`Collections - ${totalCollections}`"
          value="collection"
          :headerClass="{ 'is-hidden': !totalCollections }">
          <template #header>
            <b-tooltip
              :label="`${$t('tooltip.collections')} ${labelDisplayName}`"
              append-to-body>
              {{ $t('collections') }}
              <span class="tab-counter">{{ totalCollections }}</span>
            </b-tooltip>
          </template>
          <div class="is-flex is-justify-content-flex-end">
            <Layout class="mr-5" @change="onResize" />
            <Pagination
              hasMagicBtn
              replace
              :total="totalCollections"
              v-model="currentValue" />
          </div>
          <InfiniteLoading
            v-if="startPage > 1 && !isLoading && totalCollections > 0"
            direction="top"
            @infinite="reachTopHandler">
          </InfiniteLoading>
          <GalleryCardList
            :items="collections"
            type="collectionDetail"
            route="/rmrk/collection"
            link="rmrk/collection"
            horizontalLayout />
          <InfiniteLoading
            v-if="canLoadNextPage && !isLoading && totalCollections > 0"
            @infinite="reachBottomHandler">
          </InfiniteLoading>
          <ScrollTopButton />
        </b-tab-item>
        <b-tab-item
          :label="`History - ${totalHistory}`"
          value="history"
          :headerClass="{ 'is-hidden': !totalHistory }">
          <History
            v-if="!isLoading && activeTab === 'history'"
            :events="eventsOfNftCollection"
            :openOnDefault="isHistoryOpen"
            hideCollapse />
        </b-tab-item>
        <b-tab-item
          :label="`Sales - ${totalSales}`"
          value="sales"
          :headerClass="{ 'is-hidden': !totalSales }">
          <Sales
            v-if="!isLoading && activeTab === 'sales'"
            :issuer="id"
            :query="recentSalesForCreator"
            :events="eventsOfSales"
            :openOnDefault="isHistoryOpen"
            hideCollapse />
        </b-tab-item>
        <b-tab-item value="sold" :headerClass="{ 'is-hidden': !totalSold }">
          <template #header>
            <b-tooltip
              :label="`${$t('tooltip.sold')} ${labelDisplayName}`"
              append-to-body>
              {{ $t('profile.sold') }}
              <span class="tab-counter">{{ totalSold }}</span>
            </b-tooltip>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListSold"
            @change="totalSold = $event"
            :account="id"
            showSearchBar />
        </b-tab-item>
        <b-tab-item
          value="collected"
          :headerClass="{ 'is-hidden': !totalCollected }">
          <template #header>
            <b-tooltip
              :label="`${$t('tooltip.collected')} ${labelDisplayName}`"
              append-to-body>
              {{ $t('profile.collected') }}
              <span class="tab-counter">{{ totalCollected }}</span>
            </b-tooltip>
          </template>
          <PaginatedCardList
            :id="id"
            :query="nftListCollected"
            @change="totalCollected = $event"
            :account="id"
            showSearchBar />
        </b-tab-item>
        <b-tab-item
          value="holdings"
          :headerClass="{ 'is-hidden': !totalHoldings }">
          <template #header>
            <b-tooltip
              :label="`${$t('tooltip.holdings')} ${labelDisplayName}`"
              append-to-body>
              {{ $t('profile.holdings') }}
              <span class="tab-counter">{{ totalHoldings }}</span>
            </b-tooltip>
          </template>
          <Holding :account-id="id" />
        </b-tab-item>
        <b-tab-item value="gains" :headerClass="{ 'is-hidden': !totalGains }">
          <template #header>
            <b-tooltip
              :label="`${$t('tooltip.gains')} ${labelDisplayName}`"
              append-to-body>
              {{ $t('profile.gains') }}
              <span class="tab-counter">{{ totalGains }}</span>
            </b-tooltip>
          </template>
          <UserGainHistory :account-id="id" />
        </b-tab-item>
      </b-tabs>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, mixins, Ref, Watch } from 'nuxt-property-decorator'
import { notificationTypes, showNotification } from '@/utils/notification'
import { sanitizeIpfsUrl, fetchNFTMetadata } from '@/components/rmrk/utils'
import {
  CollectionWithMeta,
  Pack,
  Interaction,
  NftEvents,
} from '@/components/rmrk/service/scheme'

import isShareMode from '@/utils/isShareMode'
import shouldUpdate from '@/utils/shouldUpdate'
import shortAddress from '@/utils/shortAddress'
import nftListByIssuerAndOwner from '@/queries/nftListByIssuerAndOwner.graphql'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import InfiniteScrollMixin from '~/utils/mixins/infiniteScrollMixin'
import collectionListByAccount from '@/queries/rmrk/subsquid/collectionListByAccount.graphql'
import { Debounce } from 'vue-debounce-decorator'
import { CollectionChartData as ChartData } from '@/utils/chart'
import allEventsByProfile from '@/queries/rmrk/subsquid/allEventsByProfile.graphql'
import recentSalesForCreator from '@/queries/rmrk/subsquid/recentSalesForCreator.graphql'
import { sortedEventByDate } from '~/utils/sorting'
import ChainMixin from '~/utils/mixins/chainMixin'
import { exist } from '../Gallery/Search/exist'
import AuthMixin from '~/utils/mixins/authMixin'

const tabNameWithoutCollections = ['holdings', 'gains']

import firstNftByIssuer from '@/queries/subsquid/general/firstNftByIssuer.graphql'
import nftListByIssuer from '@/queries/subsquid/general/nftListByIssuer.graphql'
import nftListCollected from '@/queries/subsquid/general/nftListCollected.graphql'
import nftListSold from '@/queries/subsquid/general/nftListSold.graphql'
import allNftSaleEventsByAccountId from '~/queries/rmrk/subsquid/allNftSaleEventsByAccountId.graphql'
import { NftHolderEvent } from '~/components/rmrk/Gallery/Holder/Holder.vue'
import allNftSaleEventsHistoryByAccountId from '~/queries/rmrk/subsquid/allNftSaleEventsHistoryByAccountId.graphql'

const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  PaginatedCardList: () =>
    import('@/components/rmrk/Gallery/PaginatedCardList.vue'),
  DonationButton: () => import('@/components/transfer/DonationButton.vue'),
  Avatar: () => import('@/components/shared/Avatar.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
  Holding: () => import('@/components/rmrk/Gallery/Holding.vue'),
  InfiniteLoading: () => import('vue-infinite-loading'),
  ProfileActivity: () =>
    import('@/components/rmrk/Profile/ProfileActivity.vue'),
  UserGainHistory: () =>
    import('@/components/rmrk/Gallery/UserGainHistory.vue'),
  History: () => import('@/components/rmrk/Gallery/History.vue'),
  Sales: () => import('@/components/rmrk/Profile/Sales.vue'),
  ScrollTopButton: () => import('@/components/shared/ScrollTopButton.vue'),
}

@Component<Profile>({
  name: 'Profile',
  head() {
    const title = 'NFT Artist Profile on KodaDot'
    const metaData = {
      title,
      type: 'profile',
      description:
        this.firstNFTData.description || 'Find more NFTs from this creator',
      url: `/westmint/u/${this.id}`,
      image: this.firstNFTData.image || this.defaultNFTImage,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
  components,
})
export default class Profile extends mixins(
  PrefixMixin,
  InfiniteScrollMixin,
  ChainMixin,
  AuthMixin
) {
  @Ref('tabsContainer') readonly tabsContainer

  public firstNFTData: any = {}
  protected id = this.$route.params.id || ''
  protected shortendId = ''
  protected isLoading = false
  protected collections: CollectionWithMeta[] = []
  public eventsOfNftCollection: Interaction[] | [] = []
  public eventsOfSales: Interaction[] | [] = []
  public priceChartData: [Date, number][][] = []
  protected priceData: [ChartData[], ChartData[]] | [] = []

  protected packs: Pack[] = []
  protected name = ''
  protected email = ''
  protected twitter = ''
  protected displayName = ''
  protected web = ''
  protected legal = ''
  protected riot = ''
  protected first = 20
  protected totalCreated = 0
  protected totalCollected = 0
  protected totalSold = 0
  protected totalCollections = 0
  protected totalHoldings = 0
  protected totalHistory = 0
  protected totalSales = 0
  protected totalGains = 0

  private myNftCount = 0
  protected networks = [
    {
      url: 'https://dotscanner.com/Kusama/account/',
      als: 'dotscanner',
      img: '/dotscanner.svg',
    },
    {
      url: 'https://sub.id/#/',
      als: 'subid',
      img: '/subid.svg',
    },
    {
      url: 'https://kusama.subscan.io/account/',
      als: 'subscan',
      img: '/subscan.svg',
    },
    {
      url: 'https://polkascan.io/kusama/account/',
      als: 'polkascan',
      img: '/polkascan.png',
    },
  ]

  readonly nftListByIssuer = nftListByIssuer
  readonly nftListCollected = nftListCollected
  readonly nftListSold = nftListSold
  readonly recentSalesForCreator = recentSalesForCreator
  private openHistory = true
  private openSalesTab = true

  created() {
    /*
    set totalCreated
     */
    this.$apollo
      .query({
        query: nftListByIssuer,
        client: this.client,
        variables: {
          account: this.id,
          limit: this.first,
        },
        fetchPolicy: 'no-cache',
      })
      .then((result) => {
        const { data } = result
        if (data) {
          const {
            nftEntitiesConnection: { totalCount },
          } = data
          this.totalCreated = totalCount
        }
      })

    /*
    set totalCollections
    already done in mounted method
     */

    /*
    set totalSold
     */
    this.$apollo
      .query({
        query: nftListSold,
        client: this.client,
        variables: {
          account: this.id,
          limit: this.first,
        },
        fetchPolicy: 'no-cache',
      })
      .then((result) => {
        const { data } = result
        if (data) {
          const {
            nftEntitiesConnection: { totalCount },
          } = data
          this.totalSold = totalCount
        }
      })

    /*
    set totalCollected
     */
    this.$apollo
      .query({
        query: nftListCollected,
        client: this.client,
        variables: {
          account: this.id,
          limit: this.first,
        },
        fetchPolicy: 'no-cache',
      })
      .then((result) => {
        const { data } = result
        if (data) {
          const {
            nftEntitiesConnection: { totalCount },
          } = data
          this.totalCollected = totalCount
        }
      })

    /*
    set totalHoldings
     */
    this.$apollo
      .query<NftEvents>({
        query: allNftSaleEventsByAccountId,
        client: 'subsquid',
        variables: {
          id: this.accountId,
        },
      })
      .then((result) => {
        const { data } = result
        if (data && data.nftEntities && data.nftEntities.length) {
          this.totalHoldings = data.nftEntities.length
        }
      })

    /*
    set history
     */
    this.$apollo
      .query<{ events: Interaction[] }>({
        query: allEventsByProfile,
        client: 'subsquid',
        variables: {
          id: this.id,
          search: {
            caller_eq: this.id,
          },
        },
      })
      .then((result) => {
        const { data } = result
        if (data && data.events && data.events.length) {
          this.totalHistory = data.events.length
        }
      })

    /*
    set totalSales
     */
    this.$apollo
      .query<{ events: Interaction[] }>({
        query: recentSalesForCreator,
        client: 'subsquid',
        variables: {
          id: this.id,
          limit: this.first,
          offset: (this.currentPage - 1) * this.first,
        },
      })
      .then((result) => {
        const { data } = result
        if (data && data.events && data.events.length) {
          this.totalSales = data.events.length
        }
      })

    /*
    set totalGains
     */
    this.$apollo
      .query<{ events: NftHolderEvent[] }>({
        query: allNftSaleEventsHistoryByAccountId,
        client: 'subsquid',
        variables: {
          id: this.accountId,
        },
      })
      .then((result) => {
        const { data } = result
        if (data && data.events && data.events.length) {
          this.totalGains = data.events.length
        }
      })
  }

  public async mounted() {
    await this.fetchProfile()
    this.fetchMyNftByIssuer()
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.shortendId = shortAddress(this.id)
    }
  }

  get activeTab(): string {
    return (this.$route.query.tab as string) || 'nft'
  }

  set activeTab(val) {
    this.$route.query.page = ''
    this.$router.replace({
      query: { tab: val },
    })
  }

  get isHistoryOpen(): boolean {
    return this.openHistory
  }

  get isSalesCreatorOpen(): boolean {
    return this.openSalesTab
  }

  get sharingVisible(): boolean {
    return isShareMode
  }

  get customUrl(): string {
    return `${window.location.origin}${this.$route.path}/${this.activeTab}`
  }

  get labelDisplayName(): string {
    return this.displayName ?? this.shortendId
  }

  get iframeSettings(): { width: string; height: string; customUrl: string } {
    return { width: '100%', height: '100vh', customUrl: this.customUrl }
  }

  get offset(): number {
    return this.currentValue * this.first - this.first
  }

  get defaultNFTImage(): string {
    const url = new URL(window.location.href)
    return `${url.protocol}//${url.hostname}/placeholder.webp`
  }

  set currentValue(page: number) {
    this.gotoPage(page)
  }

  get currentValue() {
    return this.currentPage
  }

  get isMyProfile(): boolean {
    return this.id === this.accountId
  }

  @Debounce(500)
  private resetPage() {
    this.gotoPage(1)
  }

  protected gotoPage(page: number) {
    this.currentPage = page
    this.startPage = page
    this.endPage = page
    this.collections = []
    this.isLoading = true
    this.fetchPageData(page)
  }

  public async fetchPageData(page: number, loadDirection = 'down') {
    if (this.isFetchingData) {
      return false
    }
    this.isFetchingData = true
    if (!this.id) {
      this.checkId()
    }
    const result = await this.$apollo.query({
      query: collectionListByAccount,
      client: this.urlPrefix === 'rmrk' ? 'subsquid' : this.urlPrefix,
      variables: {
        account: this.id,
        first: this.first,
        offset: (page - 1) * this.first,
      },
    })
    await this.handleCollectionResult(result, loadDirection)
    this.isFetchingData = false
    return true
  }

  protected async fetchProfile() {
    this.checkId()

    try {
      this.fetchPageData(this.startPage)

      this.$apollo.addSmartQuery('firstNft', {
        query: firstNftByIssuer,
        client: this.client,
        manual: true,
        loadingKey: 'isLoading',
        result: this.handleResult,
        variables: () => {
          return {
            account: this.id,
          }
        },
        fetchPolicy: 'cache-and-network',
      })
      // this.packs = await rmrkService
      //   .getPackListForAccount(this.id)
      //   .then(defaultSortBy);
      // this.$consola.log(packs)
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger)
      this.$consola.warn(e)
    }
    // this.isLoading = false;
  }

  protected async handleResult({ data }: any) {
    if (!this.firstNFTData.image && data) {
      const nfts = data.nftEntities
      if (nfts?.length) {
        const meta = await fetchNFTMetadata(nfts[0])
        this.firstNFTData = {
          ...meta,
          image: sanitizeIpfsUrl(meta.image || ''),
        }
      }
    }
  }

  protected async handleCollectionResult(
    { data }: any,
    loadDirection = 'down'
  ) {
    if (data) {
      this.totalCollections = data.stats.totalCount
      const newCollections = data.collectionEntities

      if (loadDirection === 'up') {
        this.collections = newCollections.concat(this.collections)
      } else {
        this.collections = this.collections.concat(newCollections)
      }
      this.isLoading = false
    }
    // in case user is only a collector, set tab to collected
    if (
      this.totalCollections === 0 &&
      this.activeTab &&
      !tabNameWithoutCollections.includes(this.activeTab)
    ) {
      this.$router
        .replace({ query: { tab: 'collected' } })
        .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
    }

    if (this.activeTab === 'history') {
      this.fetchCollectionEvents()
    }
    if (this.activeTab === 'sales') {
      this.fetchSalesEventByCreator()
    }
  }

  protected handleIdentity(identityFields: Record<string, string>) {
    this.displayName = identityFields?.display as string
    this.email = identityFields?.email as string
    this.twitter = identityFields?.twitter as string
    this.riot = identityFields?.riot as string
    this.web = identityFields?.web as string
    this.legal = identityFields?.legal as string
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

  // Get collection query with NFT Events on it
  protected async fetchCollectionEvents() {
    try {
      const { data } = await this.$apollo.query<{ events: Interaction[] }>({
        query: allEventsByProfile,
        client: 'subsquid',
        variables: {
          id: this.id,
          search: {
            caller_eq: this.id,
          },
        },
      })
      if (data && data.events && data.events.length) {
        let events: Interaction[] = data.events
        this.eventsOfNftCollection = [...sortedEventByDate(events, 'DESC')]
        console.log(this.eventsOfNftCollection)
        this.checkTabLocate()
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  // Get Sales event of an creator
  protected async fetchSalesEventByCreator() {
    try {
      this.isFetchingData = true
      const { data } = await this.$apollo.query<{ events: Interaction[] }>({
        query: recentSalesForCreator,
        client: 'subsquid',
        variables: {
          id: this.id,
          limit: this.first,
          offset: (this.currentPage - 1) * this.first,
        },
      })
      if (data && data.events && data.events.length) {
        let events: Interaction[] = data.events
        this.eventsOfSales = [...sortedEventByDate(events, 'DESC')]
        this.checkTabLocate()
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  @Watch('accountId')
  public async fetchMyNftByIssuer() {
    if (this.accountId && this.id && this.accountId !== this.id) {
      const { data } = await this.$apollo.query({
        query: nftListByIssuerAndOwner,
        client: this.urlPrefix,
        variables: {
          account: this.id,
          currentOwner: this.accountId,
        },
      })
      this.myNftCount = data.nFTEntities?.totalCount || 0
    }
  }

  @Watch('$route.params.id')
  protected onIdChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.resetPage()
      this.fetchProfile()

      if (this.activeTab === 'history') {
        this.fetchCollectionEvents()
      }
      if (this.activeTab === 'sales') {
        this.fetchSalesEventByCreator()
      }
    }
  }

  @Watch('activeTab')
  protected onTabChange(): void {
    if (this.activeTab === 'history') {
      this.fetchCollectionEvents()
    }
    if (this.activeTab === 'sales') {
      this.fetchSalesEventByCreator()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.invisible-tab > nav.tabs {
  display: none;
}

.tab-counter::before {
  content: ' - ';
  white-space: pre;
}

.title {
  flex-grow: 0;
  flex-basis: auto;
}
</style>
