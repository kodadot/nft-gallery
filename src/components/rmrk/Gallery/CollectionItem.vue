<template>
  <div class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half has-text-centered">
          <div class="container image is-128x128 mb-2">
            <BasicImage
              :src="image"
              :alt="name"
              rounded
              customClass="collection__image"
            />
          </div>
          <h1 class="title is-2">
            <template v-if="!isLoading">
              {{ name }}
            </template>
            <b-skeleton :active="isLoading" size="is-medium"></b-skeleton>
          </h1>
        </div>
      </div>

      <div class="columns is-align-items-center">
        <div class="column">
          <div v-if="!isLoading">
            <div class="label">
              {{ $t('creator') }}
            </div>
            <div v-if="issuer" class="subtitle is-size-6">
              <ProfileLink :address="issuer" inline showTwitter />
            </div>
          </div>
          <b-skeleton :active="isLoading" width="40%" size="is-small"></b-skeleton>
          <b-skeleton :active="isLoading" width="60%" size="is-small"></b-skeleton>
        </div>

        <div class="column is-6-tablet is-7-desktop is-8-widescreen">
          <CollectionActivity :nfts="stats" />
        </div>

        <div class="column has-text-right">
          <Sharing v-if="sharingVisible"
            class="mb-2"
            :label="name"
            :iframe="iframeSettings">
              <DonationButton :address="issuer" />
          </Sharing>
        </div>
      </div>

      <b-tabs position="is-centered" v-model="activeTab">
        <b-tab-item label="Collection" value="collection">
          <div class="columns is-centered">
            <div class="column is-8 has-text-centered">
              <CollapseWrapper
                visible="collapse.collection.description.show"
                hidden="collapse.collection.description.hide"
              >
                <VueMarkdown :source="description" />
              </CollapseWrapper>
            </div>
          </div>

          <Search v-bind.sync="searchQuery">
            <Layout class="mr-5" />
            <b-field>
              <Pagination hasMagicBtn simple replace preserveScroll :total="total" v-model="currentValue" :per-page="first" />
            </b-field>
          </Search>

          <GalleryCardList :items="collection.nfts" horizontalLayout />

          <Pagination
            class="py-5"
            replace
            preserveScroll
            :total="total"
            v-model="currentValue"
            :per-page="first"
          />
        </b-tab-item>
        <b-tab-item label="Activity" value="activity">
          <CollectionPriceChart :priceData="priceData" />
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts" >
import { emptyObject } from '@/utils/empty'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { CollectionWithMeta, Interaction } from '../service/scheme'
import {
  sanitizeIpfsUrl, fetchCollectionMetadata, sortByTimeStamp, onlyEvents, onlyPriceEvents,
  eventTimestamp, soldNFTPrice, collectionFloorPriceList, PriceDataType, onlyBuyEvents
} from '../utils'
import isShareMode from '@/utils/isShareMode'
import shouldUpdate from '@/utils/shouldUpdate'
import collectionById from '@/queries/collectionById.graphql'
import nftListByCollection from '@/queries/nftListByCollection.graphql'
import { CollectionMetadata } from '../types'
import { NFT } from '@/components/rmrk/service/scheme'
import { exist } from '@/components/rmrk/Gallery/Search/exist'
import { SearchQuery } from './Search/types'
import ChainMixin from '@/utils/mixins/chainMixin'

const components = {
  GalleryCardList: () => import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  CollectionActivity: () => import('@/components/rmrk/Gallery/CollectionActivity.vue'),
  Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
  VueMarkdown: () => import('vue-markdown-render'),
  Search: () => import('./Search/SearchBarCollection.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  DonationButton: () => import('@/components/transfer/DonationButton.vue'),
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
  CollectionPriceChart: () => import('@/components/rmrk/Gallery/CollectionPriceChart.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  CollapseWrapper: () => import('@/components/shared/collapse/CollapseWrapper.vue'),
}
@Component<CollectionItem>({
  metaInfo() {
    return {
      title: 'KodaDot cares about environmental impact',
      titleTemplate: '%s | Low Carbon NFTs',
      meta: [
        { name: 'description', content: 'Creating Carbonless NFTs on Kusama' },
        { property: 'og:title', content: this.collection.name || 'KodaDot cares about environmental impact'},
        { property: 'og:url', content: 'https://nft.kodadot.xyz/' + this.$route.path },
        { property: 'og:image', content: this.meta.image || 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
        { property: 'og:description', content: this.meta.description || 'Creating Carbonless NFTs on Kusama'},
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:title', content: this.collection.name || 'KodaDOT cares about environmental impact'},
        { property: 'twitter:description', content: this.meta.description || 'Creating Carbonless NFTs on Kusama'},
        { property: 'twitter:image', content: this.meta.image || 'https://nft.kodadot.xyz/kodadot_carbonless.jpg'},
      ]
    }
  },
  components })
export default class CollectionItem extends Mixins(
  ChainMixin
) {
  private id = '';
  private collection: CollectionWithMeta = emptyObject<CollectionWithMeta>();
  public meta: CollectionMetadata = emptyObject<CollectionMetadata>();
  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: false,
  };
  public activeTab = 'collection';
  private currentValue = 1;
  private first = 15;
  protected total = 0;
  protected stats: NFT[] = [];
  protected priceData: any = [];

  get isLoading(): boolean {
    return this.$apollo.queries.collection.loading
  }

  get offset(): number {
    return this.currentValue * this.first - this.first
  }

  get image(): string|undefined {
    return this.meta.image
  }

  get description(): string {
    return this.meta.description || ''
  }

  get name(): string {
    return this.collection.name || this.id
  }

  get nfts(): NFT[] {
    return this.collection.nfts || []
  }

  get issuer(): string {
    return this.collection.issuer || ''
  }

  get sharingVisible(): boolean {
    return !isShareMode
  }

  private buildSearchParam(): Record<string, unknown>[] {
    const params = []

    if (this.searchQuery.search) {
      params.push({
        name: { likeInsensitive: `%${this.searchQuery.search}%` }
      })
    }

    if (this.searchQuery.listed) {
      params.push({
        price: { greaterThan: '0' }
      })
    }

    return params
  }

  public created(): void {
    this.checkId()
    this.checkActiveTab()
    this.loadStats()
    this.$apollo.addSmartQuery('collection', {
      query: collectionById,
      loadingKey: 'isLoading',
      variables: () => {
        return {
          id: this.id,
          orderBy: this.searchQuery.sortBy,
          search: this.buildSearchParam(),
          first: this.first,
          offset: this.offset
        }
      },
      update: ({ collectionEntity }) => ({
        ...collectionEntity,
        nfts: collectionEntity.nfts.nodes
      }),
      result: this.handleResult,
    })

  }

  public loadStats(): void {
    const nftStatsP = this.$apollo.query({
      query: nftListByCollection,
      variables: {
        id: this.id,
      }
    })

    nftStatsP.then(({ data }) => data?.nFTEntities?.nodes || []).then(nfts => {
      this.stats = nfts
      this.loadPriceData()
    })
  }

  public loadPriceData(): void {
    this.priceData = []

    const events: Interaction[][] = this.stats?.map(onlyEvents) || []
    const priceEvents: Interaction[][] = events.map(this.priceEvents) || []

    const overTime: string[] = priceEvents.flat().sort(sortByTimeStamp).map(eventTimestamp)

    const floorPriceData: PriceDataType[] = overTime.map(collectionFloorPriceList(priceEvents, this.decimals))

    const buyEvents = events.map(onlyBuyEvents)?.flat().sort(sortByTimeStamp)
    const soldPriceData: PriceDataType[] = buyEvents?.map(soldNFTPrice(this.decimals))

    this.priceData = [floorPriceData, soldPriceData]
  }

  public async handleResult({data}: any): Promise<void> {
    this.total = data.collectionEntity.nfts.totalCount
    await this.fetchMetadata()
  }

  public async fetchMetadata(): Promise<void> {
    if (this.collection['metadata'] && !this.meta['image']) {
      const meta = await fetchCollectionMetadata(this.collection)
      this.meta = {
        ...meta,
        image: sanitizeIpfsUrl(meta.image || ''),
      }
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

  @Watch('activeTab')
  protected onTabChange(val: string, oldVal: string): void {
    if (shouldUpdate(val, oldVal)) {
      this.$router.replace({
        name: String(this.$route.name),
        query: { tab: val },
      })
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

<style>
.collection__image img {
  color: transparent;
}
</style>
