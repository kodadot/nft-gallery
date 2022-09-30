<template>
  <div class="collections">
    <Loader :value="isLoading" />
    <Search
      v-bind.sync="searchQuery"
      hide-search
      :is-moon-river="urlPrefix === 'movr'"
      :sort-option="collectionSortOption"
      @resetPage="resetPage">
      <b-field class="is-flex">
        <Layout class="mr-5" @change="onResize" />
        <Pagination
          v-model="currentValue"
          has-magic-btn
          simple
          replace
          preserve-scroll
          :total="total"
          :per-page="first" />
      </b-field>
    </Search>

    <div>
      <InfiniteLoading
        v-if="startPage > 1 && !isLoading && total > 0"
        direction="top"
        @infinite="reachTopHandler" />
      <div
        :id="scrollContainerId"
        class="columns is-multiline"
        @scroll="onScroll">
        <div
          v-for="collection in results"
          :key="collection.id"
          :class="`column is-4 column-padding ${scrollItemClassName} ${classLayout}`">
          <nuxt-link
            :to="`/${urlPrefix}/collection/${collection.id}`"
            tag="div"
            class="card collection-card"
            :data-cy="results.indexOf(collection)">
            <div class="card-image">
              <BasicImage
                :src="collection.image"
                :alt="collection.name"
                custom-class="collection__image-wrapper" />
            </div>

            <div class="card-content">
              <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
                <CollectionDetail
                  :nfts="collection.nfts"
                  :name="collection.name" />
              </nuxt-link>
              <b-skeleton :active="isLoading" />
            </div>
          </nuxt-link>
        </div>
      </div>
      <InfiniteLoading
        v-if="canLoadNextPage && !isLoading && total > 0"
        @infinite="reachBottomHandler" />
      <ScrollTopButton />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import {
  Collection,
  CollectionWithMeta,
  Metadata,
  NFTMetadata,
} from '@/components/rmrk/service/scheme'
import { getSanitizer } from '@/components/rmrk/utils'
import { SearchQuery } from '@/components/rmrk/Gallery/search/types'
import 'lazysizes'

import collectionListWithSearch from '@/queries/subsquid/general/collectionListWithSearch.graphql'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import InfiniteScrollMixin from '~/utils/mixins/infiniteScrollMixin'
import { mapOnlyMetadata } from '~/utils/mappers'
import {
  getCloudflareImageLinks,
  processMetadata,
} from '~/utils/cachingStrategy'
import { CollectionMetadata } from '~/components/rmrk/types'
import { fastExtract } from '~/utils/ipfs'

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
  CollectionDetail: () =>
    import('@/components/rmrk/Gallery/CollectionDetail.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  Layout: () => import('@/components/rmrk/Gallery/Layout.vue'),
  ScrollTopButton: () => import('@/components/shared/ScrollTopButton.vue'),
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

    const metadataList: string[] = this.collections.map(mapOnlyMetadata)
    const imageLinks = await getCloudflareImageLinks(metadataList)
    processMetadata<CollectionMetadata>(metadataList, (meta, i) => {
      Vue.set(this.collections, i, {
        ...this.collections[i],
        ...meta,
        image:
          imageLinks[fastExtract(this.collections[i]?.metadata)] ||
          getSanitizer(meta.image || '')(meta.image || ''),
      })
    })

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

<style lang="scss">
// move to scss component
@import '@/styles/abstracts/variables';
.card-image__burned {
  filter: blur(7px);
}

.collections {
  &__image-wrapper {
    position: relative;
    margin: auto;
    padding-top: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  .collection-card {
    cursor: pointer;
  }

  .card-image img {
    border-radius: 0px;
    top: 50%;
    transition: all 0.3s;
    display: block;
    width: 100%;
    height: auto;
    transform: scale(1);
  }

  .has-text-overflow-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
  }

  .card-image__emotes__count {
    vertical-align: text-bottom;
  }

  .columns {
    padding-top: 10px;

    .card {
      border-radius: 0px;
      position: relative;
      overflow: hidden;

      &-image {
        &__emotes {
          position: absolute;
          background-color: $primary-light;
          border-radius: 4px;
          padding: 3px 8px;
          color: #fff;
          top: 10px;
          right: 10px;
          font-size: 14px;
          z-index: 3;
          transition: all 0.3s;
        }

        &__price {
          position: absolute;
          background-color: $grey-darker;
          border-radius: 4px;
          padding: 3px 8px;
          color: #fff;
          bottom: 10px;
          left: 10px;
          font-size: 14px;
          z-index: 3;
          transition: all 0.3s;
        }
      }

      .card-content {
        .heading--inline {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #fff;
        }

        .level-item {
          padding: 0.1rem;
          text-align: left;
          line-height: initial;
        }

        .collection-title {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #fff;
          font-size: 1.5rem;
        }
        .collection-title-class {
          max-width: 100%;
          text-align: center;
        }
      }

      @media screen and (min-width: 1024px) {
        &-content {
          position: absolute;
          bottom: -45px;
          left: 0;
          width: 100%;
          transition: all 0.3s;
          background: #fff;
          opacity: 0;
        }

        &:hover .card-content {
          background: $frosted-glass-background;
          backdrop-filter: $frosted-glass-backdrop-filter;
          bottom: 0;
          border-radius: 0;
          opacity: 1;
          z-index: 2;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        &:hover .collection__image-wrapper img {
          transform: scale(1.1);
          transition: transform 0.3s linear;
        }

        &:hover .card-image__emotes {
          top: 15px;
          right: 15px;
        }

        &:hover .card-image__price {
          bottom: 62px;
        }
      }
    }
  }
}
</style>
