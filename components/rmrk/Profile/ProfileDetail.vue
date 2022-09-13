<template>
  <section>
    <div class="columns is-centered">
      <div class="column is-half has-text-centered">
        <div class="container image is-64x64 mb-2">
          <Avatar :value="id" />
        </div>
        <h1 class="title is-2" data-cy="user-identity">
          <a
            v-if="hasBlockExplorer"
            :href="explorer"
            target="_blank"
            rel="noopener noreferrer">
            <Identity
              ref="identity"
              :address="id"
              emit
              @change="handleIdentity" />
          </a>
          <Identity
            v-else
            ref="identity"
            :address="id"
            emit
            @change="handleIdentity" />
        </h1>

        <nuxt-link v-if="isAllowSetIdentity" to="/identity">
          + {{ $t('identity.set') }}
        </nuxt-link>
      </div>
    </div>

    <div class="columns is-align-items-center">
      <div v-if="hasBlockExplorer" class="column">
        <div class="label">
          {{ $t('profile.user') }}
        </div>
        <div class="subtitle is-size-6">
          <ProfileLink :address="id" :inline="true" show-twitter show-discord />
          <div v-if="myNftCount > 0" class="ml-1 mt-2">
            {{ $t('profile.collectedFromCreator', [myNftCount]) }}
          </div>
        </div>
      </div>
      <div v-else class="column" />
      <div class="column is-12-mobile is-6-tablet is-7-desktop is-8-widescreen">
        <ProfileActivity :id="id" />
      </div>
      <div class="column has-text-right">
        <div v-if="hasBlockExplorer" class="is-flex is-justify-content-right">
          <div v-for="network in networks" :key="network.alt" class="control">
            <b-button class="share-button" type="is-bordered-light">
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
          v-if="!sharingVisible"
          class="mb-2"
          :label="$t('sharing.profile')"
          :iframe="iframeSettings">
          <DonationButton :address="id" />
        </Sharing>
      </div>
    </div>

    <section>
      <b-tabs
        v-model="activeTab"
        :class="{ 'invisible-tab': sharingVisible }"
        class="tabs-container-mobile"
        destroy-on-hide
        expanded>
        <b-tab-item value="nft" :header-class="{ 'is-hidden': !totalCreated }">
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
            :account="id"
            :show-search-bar="true"
            @change="totalCreated = $event" />
        </b-tab-item>
        <b-tab-item
          :label="`Collections - ${totalCollections}`"
          value="collection"
          :header-class="{ 'is-hidden': !totalCollections }">
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
              v-model="currentValue"
              has-magic-btn
              replace
              :total="totalCollections" />
          </div>
          <InfiniteLoading
            v-if="startPage > 1 && !isLoading && totalCollections > 0"
            direction="top"
            @infinite="reachTopHandler">
          </InfiniteLoading>
          <GalleryCardList
            :items="collections"
            type="collectionDetail"
            :route="`/${urlPrefix}/collection`"
            :link="`${urlPrefix}/collection`"
            horizontal-layout />
          <InfiniteLoading
            v-if="canLoadNextPage && !isLoading && totalCollections > 0"
            @infinite="reachBottomHandler">
          </InfiniteLoading>
          <ScrollTopButton />
        </b-tab-item>
        <b-tab-item
          :label="`History - ${totalHistory}`"
          value="history"
          :header-class="{ 'is-hidden': !totalHistory }">
          <History
            v-if="!isLoading && activeTab === 'history'"
            :events="eventsOfNftCollection"
            :open-on-default="isHistoryOpen"
            display-item
            hide-collapse />
        </b-tab-item>
        <b-tab-item
          :label="`Sales - ${totalSales}`"
          value="sales"
          :header-class="{ 'is-hidden': !totalSales }">
          <Sales
            v-if="!isLoading && activeTab === 'sales'"
            :issuer="id"
            :query="recentSalesForCreator"
            :events="eventsOfSales"
            :open-on-default="isHistoryOpen"
            hide-collapse />
        </b-tab-item>
        <b-tab-item value="sold" :header-class="{ 'is-hidden': !totalSold }">
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
            :account="id"
            show-search-bar
            @change="totalSold = $event" />
        </b-tab-item>
        <b-tab-item
          value="collected"
          :header-class="{ 'is-hidden': !totalCollected }">
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
            :account="id"
            show-search-bar
            @change="totalCollected = $event" />
        </b-tab-item>
        <b-tab-item
          v-if="isMoonriver"
          value="holdings"
          :header-class="{ 'is-hidden': !totalHoldings }">
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
        <b-tab-item
          v-if="isMoonriver"
          value="gains"
          :header-class="{ 'is-hidden': !totalGains }">
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
        <b-tab-item
          v-if="isBsx || isSnek"
          :label="`Offers Made${
            userOfferList.length ? ' - ' + userOfferList.length : ''
          }`"
          value="offers">
          <OffersUserTable
            :offers="userOfferList"
            :owner-id="id"
            hide-collapse
            @offersListUpdate="offersListUpdate" />
        </b-tab-item>
      </b-tabs>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Ref, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'

import {
  CollectionWithMeta,
  Interaction,
  NftEvents,
  Pack,
} from '@/components/rmrk/service/scheme'
import { Offer, OfferResponse } from '@/components/bsx/Offer/types'
import { fetchNFTMetadata, sanitizeIpfsUrl } from '@/components/rmrk/utils'

import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import InfiniteScrollMixin from '@/utils/mixins/infiniteScrollMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import { notificationTypes, showNotification } from '@/utils/notification'
import { CollectionChartData as ChartData } from '@/utils/chart'
import isShareMode from '@/utils/isShareMode'
import resolveQueryPath from '@/utils/queryPathResolver'
import shortAddress from '@/utils/shortAddress'
import shouldUpdate from '@/utils/shouldUpdate'
import { sortedEventByDate } from '@/utils/sorting'

import allEventsByProfile from '@/queries/rmrk/subsquid/allEventsByProfile.graphql'
import allNftSaleEventsByAccountId from '@/queries/rmrk/subsquid/allNftSaleEventsByAccountId.graphql'
import allNftSaleEventsHistoryByAccountId from '@/queries/rmrk/subsquid/allNftSaleEventsHistoryByAccountId.graphql'
import collectionListByAccount from '@/queries/rmrk/subsquid/collectionListByAccount.graphql'
import firstNftByIssuer from '@/queries/subsquid/general/firstNftByIssuer.graphql'
import nftListByIssuer from '@/queries/subsquid/general/nftListByIssuer.graphql'
import nftListCollected from '@/queries/subsquid/general/nftListCollected.graphql'
import nftListSold from '@/queries/subsquid/general/nftListSold.graphql'
import offerListUser from '@/queries/subsquid/bsx/offerListUser.graphql'
import recentSalesForCreator from '@/queries/rmrk/subsquid/recentSalesForCreator.graphql'

import { getExplorer, hasExplorer } from './utils'
import { NftHolderEvent } from '../Gallery/Holder/Holder.vue'
import { exist } from '@/components/search/exist'

const tabNameWithoutCollections = ['holdings', 'gains']

const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  Sharing: () => import('@/components/shared/Sharing.vue'),
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
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
  OffersUserTable: () => import('@/components/bsx/Offer/OffersUserTable.vue'),
  Sales: () => import('@/components/rmrk/Profile/Sales.vue'),
  ScrollTopButton: () => import('@/components/shared/ScrollTopButton.vue'),
}

@Component<ProfileDetail>({
  name: 'Profile',
  head() {
    const title = 'NFT Artist Profile on KodaDot'
    const metaData = {
      title,
      type: 'profile',
      description:
        this.firstNFTData.description || 'Find more NFTs from this creator',
      url: `/${this.urlPrefix}/u/${this.id}`,
      image: this.firstNFTData.image || this.defaultNFTImage,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
  components,
})
export default class ProfileDetail extends mixins(
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
  public userOfferList: Offer[] = []
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
    set history
     */
    this.$apollo
      .query<{ events: Interaction[] }>({
        query: allEventsByProfile,
        client: this.client,
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
        client: this.client,
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

    if (this.isMoonriver) {
      /*
    set totalHoldings
     */
      this.$apollo
        .query<NftEvents>({
          query: allNftSaleEventsByAccountId,
          client: this.client,
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
    set totalGains
     */
      this.$apollo
        .query<{ events: NftHolderEvent[] }>({
          query: allNftSaleEventsHistoryByAccountId,
          client: this.client,
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

  get isMoonriver(): boolean {
    return this.urlPrefix === 'movr'
  }

  get isBsx(): boolean {
    return this.urlPrefix === 'bsx'
  }

  get isSnek(): boolean {
    return this.urlPrefix === 'snek'
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

  get isAllowSetIdentity(): boolean {
    return !this.displayName && this.isMyProfile && this.hasBlockExplorer
  }

  get hasBlockExplorer(): boolean {
    return hasExplorer(this.urlPrefix)
  }

  get explorer() {
    return getExplorer(this.urlPrefix, this.id)
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
    this.isFetchingData = false
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
      client: this.client,
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

    this.fetchCurrentTabData()
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
        client: this.client,
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
        client: this.client,
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

  // Get offers for user
  protected async fetchOfferEvents(isBurned = false) {
    try {
      const { data } = await this.$apollo.query<OfferResponse>({
        query: offerListUser,
        client: this.client,
        variables: {
          id: this.id,
          burned: isBurned,
        },
      })
      if (data?.offers?.length) {
        this.userOfferList = data.offers
      } else {
        this.userOfferList = []
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  public offersListUpdate(bool) {
    this.fetchOfferEvents(bool)
  }

  @Watch('accountId')
  public async fetchMyNftByIssuer() {
    if (this.id && shouldUpdate(this.accountId, this.id)) {
      const query = await resolveQueryPath(
        this.client,
        'nftListByIssuerAndOwner'
      )
      const { data } = await this.$apollo.query({
        query: query.default,
        client: this.client,
        variables: {
          account: this.id,
          currentOwner: this.accountId,
        },
      })
      this.myNftCount = data.nftList?.totalCount || 0
    }
  }

  @Watch('$route.params.id')
  protected onIdChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.resetPage()
      this.fetchProfile()

      this.fetchCurrentTabData()
    }
  }

  @Watch('activeTab')
  protected onTabChange(): void {
    this.fetchCurrentTabData()
  }

  protected fetchCurrentTabData() {
    if (this.activeTab === 'history') {
      this.fetchCollectionEvents()
    }
    if (this.activeTab === 'sales') {
      this.fetchSalesEventByCreator()
    }
    if (this.activeTab === 'offers') {
      this.fetchOfferEvents()
    }
  }
}
</script>

<style lang="scss" scoped>
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
