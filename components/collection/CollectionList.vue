<template>
  <div class="collections">
    <div class="is-flex is-flex-direction-row-reverse py-5">
      <div v-show="total">{{ total }} {{ $t('items') }}</div>
    </div>
    <hr class="mt-0" />
    <InfiniteLoading
      v-if="startPage > 1 && !isLoading && total > 0"
      :distance="prefetchDistance"
      direction="top"
      @infinite="reachTopHandler" />
    <DynamicGrid
      :id="scrollContainerId"
      grid-size="medium"
      :default-width="{ small: 16 * 15, medium: 16 * 20, large: 16 * 25 }"
      :mobile-variant="false">
      <div
        v-for="(collection, index) in results"
        :key="collection.id"
        :class="scrollItemClassName"
        :data-cy="`collection-index-${index}`">
        <CollectionCard :is-loading="isLoading" :collection="collection" />
      </div>
    </DynamicGrid>
    <InfiniteLoading
      v-if="canLoadNextPage && !isLoading && total > 0"
      :distance="prefetchDistance"
      @infinite="reachBottomHandler" />
    <EmptyResult v-if="total === 0" />
    <ScrollTopButton />
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import {
  Collection,
  CollectionWithMeta,
} from '@/components/rmrk/service/scheme'
import { SearchQuery } from '@/components/search/types'
import 'lazysizes'
import collectionListWithSearch from '@/queries/subsquid/general/collectionListWithSearch.graphql'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import InfiniteScrollMixin from '~/utils/mixins/infiniteScrollMixin'
import { getDenyList } from '~/utils/prefix'
import shouldUpdate from '@/utils/shouldUpdate'

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
  CollectionCard: () => import('@/components/collection/CollectionCard.vue'),
  EmptyResult: () => import('@/components/common/EmptyResult.vue'),
  DynamicGrid: () => import('@/components/shared/DynamicGrid.vue'),
}

@Component<CollectionList>({
  components,
})
export default class CollectionList extends mixins(
  PrefixMixin,
  InfiniteScrollMixin
) {
  private collections: Collection[] = []
  private placeholder =
    this.$colorMode.preference === 'dark'
      ? '/placeholder.webp'
      : '/placeholder-white.webp'
  private isLoading = true
  private searchQuery: SearchQuery = {
    search: this.$route.query?.search?.toString() ?? '',
    type: this.$route.query?.type?.toString() ?? '',
    sortBy:
      typeof this.$route.query?.sort === 'string'
        ? [this.$route.query?.sort]
        : this.$route.query?.sort,
    listed: this.$route.query?.listed?.toString() === 'true',
  }

  set currentValue(page: number) {
    this.gotoPage(page)
  }

  get currentValue() {
    return this.currentPage
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
    // setting the default layout until redesign explorer menubar: YOLO
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
  }

  @Watch('$route.query.search')
  protected onSearchChange(val: string, oldVal: string) {
    if (val !== oldVal) {
      this.resetPage()
      this.searchQuery.search = val || ''
    }
  }

  @Watch('$route.query.sort')
  protected onSortChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.searchQuery.sortBy = val
      this.resetPage()
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
