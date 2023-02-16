<template>
  <div>
    <Search
      v-if="showSearchBar"
      v-bind.sync="searchQuery"
      @resetPage="resetPage">
      <Layout class="mr-5" @change="onResize" />
      <b-field>
        <Pagination
          v-model="currentValue"
          has-magic-btn
          simple
          replace
          :total="total" />
      </b-field>
    </Search>
    <InfiniteLoading
      v-if="startPage > 1 && !isLoading && total > 0"
      :distance="prefetchDistance"
      direction="top"
      @infinite="reachTopHandler"></InfiniteLoading>
    <GalleryNftCardList :items="items" />
    <InfiniteLoading
      v-if="canLoadNextPage && !isLoading && total > 0"
      :distance="prefetchDistance"
      @infinite="reachBottomHandler"></InfiniteLoading>
    <ScrollTopButton />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { DocumentNode } from 'graphql'
import { NFTWithMeta } from '../service/scheme'
import { SearchQuery } from '@/components/rmrk/Gallery/search/types'
import InfiniteScrollMixin from '~/utils/mixins/infiniteScrollMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { Debounce } from 'vue-debounce-decorator'
import shouldUpdate from '~/utils/shouldUpdate'

const components = {
  GalleryNftCardList: () =>
    import('@/components/shared/gallery/GalleryNftCardList.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  Search: () => import('@/components/search/SearchCollection.vue'),
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
  InfiniteLoading: () => import('vue-infinite-loading'),
  ScrollTopButton: () => import('@/components/shared/ScrollTopButton.vue'),
}

@Component({ components })
export default class PaginatedCardList extends mixins(
  PrefixMixin,
  InfiniteScrollMixin
) {
  @Prop({ default: 'gallery' }) public route!: string
  @Prop() public query!: DocumentNode
  @Prop(String) public account!: string
  @Prop(Boolean) public showSearchBar!: boolean

  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: false,
    owned: false,
  }
  protected first = 20
  protected items: NFTWithMeta[] = []
  private isLoading = true

  private get buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    if (this.searchQuery.search) {
      params.push({
        name_containsInsensitive: this.searchQuery.search,
      })
    }

    if (this.searchQuery.listed) {
      params.push({ price_gt: '0' })
    }

    return params
  }

  set currentValue(page: number) {
    this.gotoPage(page)
  }

  get currentValue() {
    return this.currentPage
  }

  get link(): string {
    return `${this.urlPrefix}/${this.route}`
  }

  get prefixedRoute(): string {
    return `/${this.link}`
  }

  @Debounce(500)
  private resetPage() {
    this.gotoPage(1)
  }

  protected gotoPage(page: number) {
    this.currentPage = page
    this.startPage = page
    this.endPage = page
    this.items = []
    this.isFetchingData = false
    this.isLoading = true
    this.fetchPageData(page)
  }

  get remapSortBy(): string {
    const remapTable = {
      BLOCK_NUMBER_DESC: 'blockNumber_DESC',
      BLOCK_NUMBER_ASC: 'blockNumber_ASC',
      UPDATED_AT_DESC: 'updatedAt_DESC',
      UPDATED_AT_ASC: 'updatedAt_ASC',
      PRICE_DESC: 'price_DESC',
      PRICE_ASC: 'price_ASC',
    }

    return remapTable[this.searchQuery.sortBy || '']
  }

  created() {
    this.fetchPageData(this.startPage)
    if (this.urlPrefix === 'bsx') {
      this.searchQuery.sortBy = this.remapSortBy
    }
  }

  public async fetchPageData(page: number, loadDirection = 'down') {
    if (this.isFetchingData) {
      return false
    }
    this.isFetchingData = true
    const result = await this.$apollo.query({
      query: this.query,
      client: this.client,
      variables: {
        account: this.account,
        orderBy: this.remapSortBy,
        and: this.buildSearchParam,
        limit: this.first,
        offset: (page - 1) * this.first,
      },
      fetchPolicy: 'no-cache',
    })
    await this.handleResult(result, loadDirection)
    this.isFetchingData = false
    return true
  }

  protected async handleResult({ data }: any, loadDirection = 'down') {
    if (data) {
      const {
        nftEntitiesConnection: { totalCount },
      } = data
      const helper = (nft) => ({
        ...nft,
        emoteCount: nft?.emotes?.length,
      })
      const nftEntities = data.nftEntities.map(helper)

      if (loadDirection === 'up') {
        this.items = nftEntities.concat(this.items)
      } else {
        this.items = this.items.concat(nftEntities)
      }

      this.total = totalCount
      // this.items = nftEntities
      this.isLoading = false
      this.$emit('change', this.total)
    }
  }

  @Watch('$route.query.search')
  protected onSearchChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.resetPage()
      this.searchQuery.search = val || ''
    }
  }

  @Watch('searchQuery', { deep: true })
  protected onSearchQueryChange() {
    if (!this.isLoading) {
      this.resetPage()
    }
  }
}
</script>
