<template>
  <div>
    <Search
      v-bind.sync="searchQuery"
      v-if="showSearchBar"
      @resetPage="resetPage">
      <Layout class="mr-5" @change="onResize" />
      <b-field>
        <Pagination
          hasMagicBtn
          simple
          replace
          :total="total"
          v-model="currentValue" />
      </b-field>
    </Search>
    <InfiniteLoading
      v-if="startPage > 1 && !isLoading && total > 0"
      direction="top"
      @infinite="reachTopHandler"></InfiniteLoading>
    <GalleryCardList
      :items="items"
      horizontalLayout
      :route="route"
      :link="link"
      :listed="searchQuery.listed" />
    <InfiniteLoading
      v-if="canLoadNextPage && !isLoading && total > 0"
      @infinite="reachBottomHandler"></InfiniteLoading>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import { DocumentNode } from 'graphql'
import { NFTWithMeta } from '../service/scheme'
import { SearchQuery } from '@/components/rmrk/Gallery/Search/types'
import InfiniteScrollMixin from '~/utils/mixins/infiniteScrollMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { getCloudflareImageLinks } from '~/utils/cachingStrategy'
import { mapOnlyMetadata } from '~/utils/mappers'
import { Debounce } from 'vue-debounce-decorator'
import shouldUpdate from '~/utils/shouldUpdate'

const components = {
  GalleryCardList: () => import('./GalleryCardList.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  Search: () =>
    import('@/components/rmrk/Gallery/Search/SearchBarCollection.vue'),
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
  InfiniteLoading: () => import('vue-infinite-loading'),
}

@Component({ components })
export default class PaginatedCardList extends mixins(
  PrefixMixin,
  InfiniteScrollMixin
) {
  @Prop({ default: '/rmrk/detail' }) public route!: string
  @Prop({ default: 'rmrk/detail' }) public link!: string
  @Prop() public query!: DocumentNode
  @Prop(String) public account!: string
  @Prop(Boolean) public showSearchBar!: boolean

  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: false,
  }
  protected first = 20
  protected items: NFTWithMeta[] = []
  private isLoading = true

  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    if (this.searchQuery.search) {
      params.push({
        name: { likeInsensitive: `%${this.searchQuery.search}%` },
      })
    }

    if (this.searchQuery.listed) {
      params.push({
        price: { greaterThan: '0' },
      })
    }

    return params
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

  private gotoPage(page: number) {
    this.currentPage = page
    this.startPage = page
    this.endPage = page
    this.items = []
    this.isLoading = true
    this.fetchPageData(page)
  }

  created() {
    this.fetchPageData(this.startPage)
  }

  public async fetchPageData(page: number, loadDirection = 'down') {
    if (this.isFetchingData) {
      return false
    }
    this.isFetchingData = true
    const result = await this.$apollo.query({
      query: this.query,
      client: this.urlPrefix,
      variables: {
        account: this.account,
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

  protected async handleResult({ data }: any, loadDirection = 'down') {
    if (data) {
      const { nodes, totalCount } = data.nFTEntities
      const newNfts = nodes.map((e: any) => ({
        ...e,
        emoteCount: e?.emotes?.totalCount,
      }))
      await getCloudflareImageLinks(newNfts.map(mapOnlyMetadata)).catch(
        this.$consola.warn
      )

      if (loadDirection === 'up') {
        this.items = newNfts.concat(this.items)
      } else {
        this.items = this.items.concat(newNfts)
      }

      this.total = totalCount
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
    this.resetPage()
  }
}
</script>
