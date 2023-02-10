<template>
  <div class="gallery">
    <div class="is-flex is-align-self-flex-start">
      <SidebarFilter @resetPage="resetPage" />
      <div class="container">
        <!-- TODO: FilterBreadcrumbs here -->
        <div class="is-flex is-justify-content-space-between py-5">
          <BreadcrumbsFilter />
          <div v-show="total">{{ total }} {{ $t('items') }}</div>
        </div>
        <hr class="mt-0" />
        <InfiniteLoading
          v-if="startPage > 1 && !isLoading && total > 0"
          direction="top"
          :distance="prefetchDistance"
          @infinite="reachTopHandler"></InfiniteLoading>
        <div :id="scrollContainerId" class="columns is-multiline">
          <div
            v-for="(nft, index) in results"
            :key="`${nft.id}-${index}`"
            :class="`column ${classLayout} ${scrollItemClassName}`">
            <NftCard :nft="nft" :data-cy="`item-index-${index}`" />
          </div>
        </div>
        <InfiniteLoading
          v-if="canLoadNextPage && !isLoading && total > 0"
          :distance="prefetchDistance"
          @infinite="reachBottomHandler"></InfiniteLoading>
        <EmptyResult v-if="total === 0" />
        <ScrollTopButton />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'lazysizes'
import { Component, Vue, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'

import {
  NFTEntitiesWithCount,
  NFTWithCollectionMeta,
  WithData,
} from 'components/unique/graphqlResponseTypes'
import { NftEntity as GraphNFT } from '@/components/rmrk/service/types'

import { processMetadata } from '@/utils/cachingStrategy'
import { mapNFTorCollectionMetadata } from '@/utils/mappers'
import { notificationTypes, showNotification } from '@/utils/notification'
import { getDenyList } from '@/utils/prefix'
import resolveQueryPath from '@/utils/queryPathResolver'
import { unwrapSafe } from '@/utils/uniquery'

import AuthMixin from '@/utils/mixins/authMixin'
import InfiniteScrollMixin from '@/utils/mixins/infiniteScrollMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import { NFT, NFTMetadata } from '../../rmrk/service/scheme'
import { SearchQuery } from '@/components/search/types'
import { getNameOfNft } from '../../rmrk/utils'
import { getSanitizer } from '@/utils/ipfs'
import shouldUpdate from '@/utils/shouldUpdate'

type GraphResponse = NFTEntitiesWithCount<GraphNFT>

type SearchedNftsWithMeta = NFTWithCollectionMeta & NFTMetadata
const components = {
  GalleryCardList: () => import('../../rmrk/Gallery/GalleryCardList.vue'),
  Search: () => import('@/components/search/Search.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Pagination: () => import('../../rmrk/Gallery/Pagination.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  PreviewMediaResolver: () =>
    import('@/components/media/PreviewMediaResolver.vue'),
  InfiniteLoading: () => import('vue-infinite-loading'),
  ScrollTopButton: () => import('@/components/shared/ScrollTopButton.vue'),
  CommonTokenMoney: () => import('@/components/shared/CommonTokenMoney.vue'),
  CarouselMedia: () => import('@/components/carousel/module/CarouselMedia.vue'),
  CarouselInfo: () => import('@/components/carousel/module/CarouselInfo.vue'),
  NftCard: () => import('./NftCard.vue'),
  SidebarFilter: () => import('@/components/explore/SidebarFilter.vue'),
  BreadcrumbsFilter: () => import('./BreadcrumbsFilter.vue'),
  EmptyResult: () => import('@/components/common/EmptyResult.vue'),
}

@Component<Gallery>({
  components,
  name: 'Gallery',
})
export default class Gallery extends mixins(
  PrefixMixin,
  InfiniteScrollMixin,
  AuthMixin
) {
  public nfts: NFTWithCollectionMeta[] = []
  public searchQuery: SearchQuery = {
    search: this.$route.query?.search?.toString() ?? '',
    type: this.$route.query?.type?.toString() ?? '',
    sortByMultiple:
      typeof this.$route.query?.sort === 'string'
        ? [this.$route.query?.sort]
        : this.$route.query?.sort,
    listed: this.$route.query?.listed?.toString() === 'true',
    owned: this.$route.query?.owned?.toString() === 'true',
    priceMin: undefined,
    priceMax: undefined,
  }
  public isLoading = true
  public first = 20
  get showPriceValue(): boolean {
    return (
      this.searchQuery?.listed ||
      this.$store.getters['preferences/getShowPriceValue']
    )
  }

  set currentValue(page: number) {
    this.gotoPage(page)
  }

  get currentValue() {
    return this.currentPage
  }

  get classLayout() {
    return this.$store.getters['preferences/getLayoutClass']
  }

  get results() {
    return this.nfts as SearchedNftsWithMeta[]
  }

  public async created() {
    try {
      await this.fetchPageData(this.startPage)
    } catch (e) {
      showNotification((e as Error).message, notificationTypes.danger)
    }
    this.onResize()
  }

  @Debounce(500)
  public resetPage() {
    this.gotoPage(1)
  }

  protected gotoPage(page: number) {
    this.currentPage = page
    this.startPage = page
    this.endPage = page
    this.nfts = []
    this.isFetchingData = false
    this.isLoading = true
    this.fetchPageData(page)
  }

  public async fetchPageData(page: number, loadDirection = 'down') {
    if (this.isFetchingData) {
      return false
    }
    this.isFetchingData = true
    const query = await resolveQueryPath(this.client, 'nftListWithSearch')

    const result = await this.$apollo.query({
      query: query.default,
      client: this.client,
      variables: {
        denyList: getDenyList(this.urlPrefix),
        orderBy: this.searchQuery.sortByMultiple,
        search: this.buildSearchParam(),
        priceMin: this.searchQuery.priceMin,
        priceMax: this.searchQuery.priceMax,
        first: this.first,
        offset: (page - 1) * this.first,
      },
    })
    await this.handleResult(result, loadDirection)
    this.isFetchingData = false
    return true
  }

  protected async handleResult(
    {
      data,
    }: WithData<
      GraphResponse & { nftEntitiesConnection: { totalCount: number } }
    >,
    loadDirection = 'down'
  ) {
    const { nFTEntities } = data
    this.total =
      nFTEntities.totalCount || data.nftEntitiesConnection?.totalCount

    const newNfts = unwrapSafe(nFTEntities).map((e: any) => ({
      ...e,
      emoteCount: e?.emotes?.totalCount,
    }))

    if (loadDirection === 'up') {
      this.nfts = newNfts.concat(this.nfts)
    } else {
      this.nfts = this.nfts.concat(newNfts)
    }

    const metadataList: string[] = this.nfts.map(mapNFTorCollectionMetadata)

    processMetadata<NFTMetadata>(metadataList, (meta, i) => {
      const nft = this.nfts[i]
      if (!nft) {
        return
      }
      Vue.set(this.nfts, i, {
        ...nft,
        ...meta,
        image: getSanitizer(meta.image || '', 'image')(meta.image || ''),
        animation_url: getSanitizer(meta.animation_url || '')(
          meta.animation_url || ''
        ),
        type: meta.type || '',
      })
    })
    this.isLoading = false
  }

  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []
    if (this.searchQuery.search) {
      params.push({ name_containsInsensitive: this.searchQuery.search })
    }

    if (this.searchQuery.listed) {
      const minPrice = this.searchQuery.priceMin ?? '0'
      if (this.searchQuery.priceMax) {
        params.push({
          price_gt: '0',
          price_gte: minPrice,
          price_lte: this.searchQuery.priceMax,
        })
      } else {
        params.push({
          price_gt: '0',
          price_gte: minPrice,
        })
      }
    }

    if (this.searchQuery.owned && this.accountId) {
      params.push({ currentOwner_eq: this.accountId })
    }

    return params
  }

  public getDisplayNameOfNft(nft: NFT) {
    return getNameOfNft(nft)
  }

  @Watch('$route.query.search')
  protected onSearchChange(val: string, oldVal: string) {
    if (val !== oldVal) {
      this.resetPage()
      this.searchQuery.search = val || ''
    }
  }

  @Watch('$route.query.sort')
  protected onSortChange(val, oldVal) {
    if (shouldUpdate(val, oldVal)) {
      this.searchQuery.sortByMultiple = val
      this.resetPage()
    }
  }

  @Watch('$route.query.owned', { deep: true })
  @Watch('$route.query.listed', { deep: true })
  @Watch('$route.query.min', { deep: true })
  @Watch('$route.query.max', { deep: true })
  protected onRouteQueryChange() {
    this.searchQuery.owned = this.$route.query?.owned?.toString() === 'true'
    this.searchQuery.listed = this.$route.query?.listed?.toString() === 'true'
    this.searchQuery.priceMin = Number(this.$route.query?.min) || undefined
    this.searchQuery.priceMax = Number(this.$route.query?.max) || undefined
  }

  @Watch('searchQuery', { deep: true })
  protected onSearchQueryChange() {
    this.resetPage()
  }
}
</script>
