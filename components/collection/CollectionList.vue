<template>
  <div class="collections">
    <div class="is-flex is-flex-direction-row-reverse py-5">
      <div v-show="total">{{ total }} {{ $t('items') }}</div>
    </div>
    <hr class="mt-0" />
    <InfiniteLoading
      v-if="startPage > 1 && !isLoading && total > 0"
      direction="top"
      @infinite="reachTopHandler" />
    <div
      :id="scrollContainerId"
      class="columns is-multiline"
      @scroll="onScroll">
      <div
        v-for="(collection, index) in results"
        :key="collection.id"
        :class="`column is-4 column-padding ${scrollItemClassName} ${classLayout}`"
        :data-cy="`collection-index-${index}`">
        <CollectionCard :is-loading="isLoading" :collection="collection" />
      </div>
    </div>
    <InfiniteLoading
      v-if="canLoadNextPage && !isLoading && total > 0"
      @infinite="reachBottomHandler" />
    <ScrollTopButton />
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import {
  Collection,
  CollectionWithMeta,
  Metadata,
  NFTMetadata,
} from '@/components/rmrk/service/scheme'
import { SearchQuery } from '@/components/rmrk/Gallery/search/types'
import 'lazysizes'
import collectionListWithSearch from '@/queries/subsquid/general/collectionListWithSearch.graphql'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import InfiniteScrollMixin from '~/utils/mixins/infiniteScrollMixin'
import { mapOnlyMetadata } from '~/utils/mappers'
import { processMetadata } from '~/utils/cachingStrategy'
import { getDenyList } from '~/utils/prefix'

interface Image extends HTMLImageElement {
  ffInitialized: boolean
}

const components = {
  GalleryCardList: () =>
    import('@/components/rmrk/Gallery/GalleryCardList.vue'),
  InfiniteLoading: () => import('vue-infinite-loading'),
  Search: () => import('@/components/search/SearchCollection.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
  ScrollTopButton: () => import('@/components/shared/ScrollTopButton.vue'),
  CollectionCard: () => import('@/components/collection/CollectionCard'),
}

@Component<CollectionList>({
  components,
})
export default class CollectionList extends mixins(
  PrefixMixin,
  InfiniteScrollMixin
) {
  private collections: Collection[] = []
  private meta: Metadata[] = []
  private placeholder =
    this.$colorMode.preference === 'dark'
      ? '/placeholder.webp'
      : '/placeholder-white.webp'
  private isLoading = true
  private searchQuery: SearchQuery = {
    search: this.$route.query?.search?.toString() ?? '',
    type: this.$route.query?.type?.toString() ?? '',
    sortBy: this.$route.query?.sort?.toString() ?? 'blockNumber_DESC',
    listed: this.$route.query?.listed?.toString() === 'true',
  }
  private collectionSortOption: string[] = [
    'blockNumber_DESC',
    'blockNumber_ASC',
    // 'updatedAt_DESC',   // unsupported options for now
    // 'updatedAt_ASC',
  ]

  set currentValue(page: number) {
    this.gotoPage(page)
  }

  get currentValue() {
    return this.currentPage
  }

  get classLayout() {
    return this.$store.getters['preferences/getLayoutClass']
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

  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    if (this.searchQuery.search) {
      params.push({
        name_containsInsensitive: this.searchQuery.search,
      })
    }

    if (this.searchQuery.listed) {
      params.push({ nfts_some: { price_gt: '0' } })
    }

    return params
  }

  public async created() {
    this.fetchPageData(this.startPage)
    // setting the default layout until redesign explorer menubar
    this.$store.dispatch(
      'preferences/setLayoutClass',
      'is-one-quarter-desktop is-one-third-tablet'
    )
  }

  protected async fetchPageData(page: number, loadDirection = 'down') {
    if (this.isFetchingData) {
      return
    }
    this.isFetchingData = true
    const result = await this.$apollo.query({
      query: collectionListWithSearch,
      client: this.client,
      variables: {
        denyList: getDenyList(this.urlPrefix),
        orderBy: this.searchQuery.sortBy,
        search: this.buildSearchParam(),
        listed: this.searchQuery.listed
          ? [{ price: { greaterThan: '0' } }]
          : [],
        first: this.first,
        offset: (page - 1) * this.first,
      },
    })
    await this.handleResult(result, loadDirection)
    this.isFetchingData = false
    return true
  }

  protected async handleResult({ data }: any, loadDirection = 'down') {
    this.total = data.stats.totalCount
    const newCollections = data.collectionEntities.map((e: any) => ({
      ...e,
    }))

    if (loadDirection === 'up') {
      this.collections = newCollections.concat(this.collections)
    } else {
      this.collections = this.collections.concat(newCollections)
    }

    this.isLoading = false
    this.prefetchPage(this.offset + this.first, this.offset + 3 * this.first)
  }

  public async prefetchPage(offset: number, prefetchLimit: number) {
    try {
      const collections = this.$apollo.query({
        query: collectionListWithSearch,
        client: this.client,
        variables: {
          first: this.first,
          offset,
        },
      })
      const {
        data: { collectionEntities: collectionList },
      } = await collections
      const metadataList: string[] = collectionList.map(mapOnlyMetadata)
      processMetadata<NFTMetadata>(metadataList)
    } catch (e: any) {
      this.$consola.warn('[PREFETCH] Unable fo fetch', offset, e.message)
    } finally {
      if (offset <= prefetchLimit) {
        this.prefetchPage(offset + this.first, prefetchLimit)
      }
    }
  }

  @Watch('$route.query.search')
  protected onSearchChange(val: string, oldVal: string) {
    if (val !== oldVal) {
      this.resetPage()
      this.searchQuery.search = val || ''
    }
  }

  @Watch('searchQuery', { deep: true })
  protected onSearchQueryChange() {
    this.resetPage()
  }

  get results() {
    return this.collections as CollectionWithMeta[]
  }

  onError(e: Event) {
    const target = e.target as Image
    target.src = this.placeholder
  }
}
</script>
