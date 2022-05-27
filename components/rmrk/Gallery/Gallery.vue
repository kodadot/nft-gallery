<template>
  <div class="gallery container">
    <Loader :value="isLoading" />
    <!-- TODO: Make it work with graphql -->
    <Search v-bind.sync="searchQuery" @resetPage="resetPage" hideSearchInput>
      <template v-slot:next-filter>
        <b-switch
          class="gallery-switch"
          v-model="hasPassionFeed"
          :rounded="false">
          Passion Feed
        </b-switch>
      </template>
      <Pagination
        hasMagicBtn
        simple
        :total="total"
        v-model="currentValue"
        :perPage="first"
        replace
        class="remove-margin" />
    </Search>

    <div>
      <InfiniteLoading
        v-if="startPage > 1 && !isLoading && total > 0"
        direction="top"
        @infinite="reachTopHandler"></InfiniteLoading>
      <div class="columns is-multiline" :id="scrollContainerId">
        <div
          :class="`column is-4 column-padding ${scrollItemClassName}`"
          v-for="nft in results"
          :key="nft.id">
          <div class="card nft-card">
            <nuxt-link
              :to="`/${urlPrefix}/gallery/${nft.id}`"
              class="nft-card__skeleton">
              <div class="card-image">
                <span v-if="nft.emoteCount" class="card-image__emotes">
                  <b-icon icon="heart" />
                  <span class="card-image__emotes__count">{{
                    nft.emoteCount
                  }}</span>
                </span>
                <BasicImage
                  v-show="nft.image"
                  :src="nft.image"
                  :alt="nft.name"
                  customClass="gallery__image-wrapper" />

                <PreviewMediaResolver
                  v-if="!nft.image && nft.animation_url"
                  :src="nft.animation_url"
                  :metadata="nft.metadata"
                  :mimeType="nft.type" />
                <span
                  v-if="nft.price > 0 && showPriceValue"
                  class="card-image__price">
                  <Money :value="nft.price" inline />
                </span>
              </div>

              <div class="card-content">
                <span
                  v-if="!isLoading"
                  class="title mb-0 is-4 has-text-centered"
                  id="hover-title"
                  :title="nft.name">
                  <nuxt-link :to="`/${urlPrefix}/gallery/${nft.id}`">
                    <div class="has-text-overflow-ellipsis">
                      {{ nft.name }}
                    </div>
                  </nuxt-link>
                  <p
                    v-if="nft.count > 2"
                    :title="`${nft.count} items available in collection`"
                    class="is-absolute nft-collection-counter title is-6">
                    「{{ nft.count }}」
                  </p>
                </span>
                <!-- <b-skeleton :active="isLoading"> </b-skeleton> -->
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <InfiniteLoading
        v-if="canLoadNextPage && !isLoading && total > 0"
        @infinite="reachBottomHandler"></InfiniteLoading>
      <ScrollTopButton />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Vue, Watch } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { NftEntity as GraphNFT } from '@/components/rmrk/service/types'
import {
  getCloudflareImageLinks,
  processMetadata,
} from '@/utils/cachingStrategy'
import { denyList, statemineDenyList } from '@/utils/constants'
import { fastExtract } from '@/utils/ipfs'
import { logError, mapNFTorCollectionMetadata } from '@/utils/mappers'
import {
  NFTEntitiesWithCount,
  NFTWithCollectionMeta,
  WithData,
} from 'components/unique/graphqlResponseTypes'
import { DocumentNode } from 'graphql'
import 'lazysizes'
import InfiniteScrollMixin from '~/utils/mixins/infiniteScrollMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import AuthMixin from '@/utils/mixins/authMixin'
import { NFTMetadata } from '../service/scheme'
import { getSanitizer } from '../utils'
import { SearchQuery } from './Search/types'
import shouldUpdate from '~/utils/shouldUpdate'
import { exist } from '@/components/rmrk/Gallery/Search/exist'

import passionQuery from '@/queries/rmrk/subsquid/passionFeed.graphql'

type GraphResponse = NFTEntitiesWithCount<GraphNFT>

type SearchedNftsWithMeta = NFTWithCollectionMeta & NFTMetadata
const components = {
  GalleryCardList: () => import('./GalleryCardList.vue'),
  Search: () => import('./Search/SearchBar.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Pagination: () => import('./Pagination.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  PreviewMediaResolver: () =>
    import('@/components/rmrk/Media/PreviewMediaResolver.vue'),
  InfiniteLoading: () => import('vue-infinite-loading'),
  ScrollTopButton: () => import('@/components/shared/ScrollTopButton.vue'),
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
  private nfts: NFTWithCollectionMeta[] = []
  private searchQuery: SearchQuery = {
    search: this.$route.query?.search?.toString() || '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: true,
    priceMin: undefined,
    priceMax: undefined,
  }
  private isLoading = true
  private hasPassionFeed = true
  private passionList: string[] = []

  get showPriceValue(): boolean {
    return (
      this.searchQuery?.listed ||
      this.$store.getters['preferences/getShowPriceValue']
    )
  }

  get isRmrk(): boolean {
    return this.urlPrefix === 'rmrk' || this.urlPrefix === 'westend'
  }

  get getLoadAllArtwork(): boolean {
    return this.$store.getters['preferences/getLoadAllArtwork']
  }

  get queryVariables() {
    return {
      first: this.first,
      denyList: this.urlPrefix === 'rmrk' ? denyList : statemineDenyList,
      orderBy: this.searchQuery.sortBy,
      search: this.buildSearchParam(),
      priceMin: this.searchQuery.priceMin,
      priceMax: this.searchQuery.priceMax,
    }
  }

  set currentValue(page: number) {
    this.gotoPage(page)
  }

  get currentValue() {
    return this.currentPage
  }

  get results() {
    return this.nfts as SearchedNftsWithMeta[]
  }

  public async created() {
    await this.fetchPageData(this.startPage)
    exist(this.$route.query.hasPassionFeed, (val) => {
      this.hasPassionFeed = val === 'true'
    })
    this.onResize()
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
    this.fetchPageData(page)
  }

  public async fetchPageData(page: number, loadDirection = 'down') {
    if (this.isFetchingData) {
      return false
    }
    this.isFetchingData = true
    const isRemark = this.urlPrefix === 'rmrk'
    const query = isRemark
      ? await import('@/queries/nftListWithSearch.graphql')
      : await import('@/queries/unique/nftListWithSearch.graphql')

    if (this.hasPassionFeed) {
      await this.fetchPassionList()
    }

    const result = await this.$apollo.query({
      query: query.default,
      client: this.urlPrefix,
      variables: {
        denyList: isRemark ? denyList : statemineDenyList,
        orderBy: this.searchQuery.sortBy,
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

  public async fetchPassionList() {
    const {
      data: { passionFeed },
    } = await this.$apollo.query({
      query: passionQuery,
      client: 'subsquid',
      variables: {
        account: this.accountId,
      },
    })
    this.passionList = passionFeed?.map((x) => x.id) || []
  }

  protected async handleResult(
    { data }: WithData<GraphResponse>,
    loadDirection = 'down'
  ) {
    this.total = data.nFTEntities.totalCount

    const newNfts = data.nFTEntities.nodes.map((e: any) => ({
      ...e,
      emoteCount: e?.emotes?.totalCount,
    }))

    if (loadDirection === 'up') {
      this.nfts = newNfts.concat(this.nfts)
    } else {
      this.nfts = this.nfts.concat(newNfts)
    }

    const metadataList: string[] = this.nfts.map(mapNFTorCollectionMetadata)
    const imageLinks = await getCloudflareImageLinks(metadataList)

    await processMetadata<NFTMetadata>(metadataList, (meta, i) => {
      Vue.set(this.nfts, i, {
        ...this.nfts[i],
        ...meta,
        image:
          imageLinks[
            fastExtract(
              this.nfts[i].metadata || this.nfts[i].collection.metadata
            )
          ] || getSanitizer(meta.image || '')(meta.image || ''),
        animation_url: getSanitizer(meta.animation_url || '')(
          meta.animation_url || ''
        ),
        type: meta.type || '',
      })
    })
    this.isLoading = false
    await this.prefetchPage(
      this.offset + this.first,
      this.offset + 3 * this.first
    )
  }

  public async prefetchPage(offset: number, prefetchLimit: number) {
    try {
      const isRemark = this.urlPrefix === 'rmrk'
      const query = isRemark
        ? await import('@/queries/nftListWithSearch.graphql')
        : await import('@/queries/unique/nftListWithSearch.graphql')
      const nfts = this.$apollo.query({
        query: query as unknown as DocumentNode,
        client: this.urlPrefix,
        variables: {
          first: this.first,
          offset,
          denyList: isRemark ? denyList : statemineDenyList,
          orderBy: this.searchQuery.sortBy,
          search: this.buildSearchParam(),
          priceMin: this.searchQuery.priceMin,
          priceMax: this.searchQuery.priceMax,
        },
      })

      const {
        data: {
          nFTEntities: { nodes: nftList },
        },
      } = await nfts

      const metadataList: string[] = nftList.map(mapNFTorCollectionMetadata)
      await processMetadata<NFTMetadata>(metadataList)
    } catch (e) {
      logError(e, (msg) =>
        this.$consola.warn('[PREFETCH] Unable fo fetch', offset, msg)
      )
    } finally {
      if (offset <= prefetchLimit) {
        await this.prefetchPage(offset + this.first, prefetchLimit)
      }
    }
  }

  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    if (this.searchQuery.search) {
      params.push({
        name: { likeInsensitive: `%${this.searchQuery.search}%` },
      })
    }

    if (
      this.searchQuery.priceMin == undefined &&
      this.searchQuery.listed &&
      this.isRmrk
    ) {
      params.push({
        price: { greaterThan: '0' },
      })
    }

    if (
      this.searchQuery.priceMin != undefined &&
      this.searchQuery.listed &&
      this.isRmrk
    ) {
      params.push({
        price: {
          greaterThan: this.searchQuery.priceMin,
          lessThanOrEqualTo: this.searchQuery.priceMax,
        },
      })
    }

    if (this.hasPassionFeed) {
      params.push({
        issuer: { in: this.passionList },
      })
    }

    return params
  }

  @Watch('$route.query.search')
  protected onSearchChange(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.resetPage()
      this.searchQuery.search = val || ''
    }
  }

  @Watch('hasPassionFeed')
  protected onHasPassionFeed() {
    this.gotoPage(1)
    this.$router.replace({
      path: String(this.$route.path),
      query: {
        ...this.$route.query,
        hasPassionFeed: String(this.hasPassionFeed),
      },
    })
  }

  @Watch('searchQuery', { deep: true })
  protected onSearchQueryChange() {
    this.resetPage()
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.card-image__burned {
  filter: blur(7px);
}

.remove-margin nav {
  margin-bottom: 0 !important;
}

.gallery {
  &-switch {
    margin-left: 10px;
  }

  &__image-wrapper {
    position: relative;
    margin: auto;
    padding-top: 100%;
    overflow: hidden;
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

  .is-float-right {
    float: right;
  }

  .is-absolute {
    position: absolute;
  }

  .nft-collection-counter {
    top: 5px;
    right: -5px;
  }

  .columns {
    .card {
      position: relative;
      overflow: hidden;
      border-radius: 0px;

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

      .gallery__image-wrapper img {
        border-radius: 0px !important;
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
          bottom: 0;
          opacity: 1;
          z-index: 2;
          background: $frosted-glass-background;
          backdrop-filter: $frosted-glass-backdrop-filter;
          border-radius: 0;
        }

        &:hover .gallery__image-wrapper img {
          transform: scale(1.1);
          transition: transform 0.3s linear;
        }

        &:hover .gallery__image-wrapper video {
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
