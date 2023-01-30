<template>
  <div class="gallery container">
    <div class="is-flex is-align-self-flex-start">
      <SidebarFilter class="sticky" @resetPage="resetPage" />
      <div>
        <!-- TODO: FilterBreadcrumbs here -->
        <div class="is-flex is-justify-content-space-between py-5">
          <BreadcrumbsFilter />
          <div v-show="total">{{ total }} {{ $t('items') }}</div>
        </div>
        <hr class="mt-0" />
        <InfiniteLoading
          v-if="startPage > 1 && !isLoading && total > 0"
          direction="top"
          @infinite="reachTopHandler"></InfiniteLoading>
        <div :id="scrollContainerId" class="columns is-multiline">
          <div
            v-for="(nft, index) in results"
            :key="`${nft.id}-${index}`"
            :class="`column is-3 column-padding ${scrollItemClassName}`">
            <NftCard :nft="nft" :data-cy="`item-index-${index}`" />
          </div>
        </div>
        <InfiniteLoading
          v-if="canLoadNextPage && !isLoading && total > 0"
          @infinite="reachBottomHandler"></InfiniteLoading>
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
import { logError, mapNFTorCollectionMetadata } from '@/utils/mappers'
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
  SidebarFilter: () => import('./SidebarFilter.vue'),
  BreadcrumbsFilter: () => import('./BreadcrumbsFilter.vue'),
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
    sortByMultiple: this.$route.query?.sort?.toString()
      ? [this.$route.query?.sort?.toString()]
      : undefined,
    listed: this.$route.query?.listed?.toString() === 'true',
    owned: this.$route.query?.owned?.toString() === 'true',
    priceMin: undefined,
    priceMax: undefined,
  }
  public isLoading = true

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

    await processMetadata<NFTMetadata>(metadataList, (meta, i) => {
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
    await this.prefetchPage(
      this.offset + this.first,
      this.offset + 3 * this.first
    )
  }

  public async prefetchPage(offset: number, prefetchLimit: number) {
    try {
      const query = await resolveQueryPath(this.client, 'nftListWithSearch')
      const nfts = this.$apollo.query({
        query: query.default,
        client: this.client,
        variables: {
          first: this.first,
          offset,
          denyList: getDenyList(this.urlPrefix),
          orderBy: this.searchQuery.sortByMultiple,
          search: this.buildSearchParam(),
          priceMin: this.searchQuery.priceMin,
          priceMax: this.searchQuery.priceMax,
        },
      })

      const {
        data: { nFTEntities },
      } = await nfts
      const nftList = unwrapSafe(nFTEntities)
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

  // @Watch('searchQuery', { deep: true })
  @Watch('$route.query', { deep: true })
  protected onSearchQueryChange() {
    this.searchQuery.owned = this.$route.query?.owned?.toString() === 'true'
    this.searchQuery.listed = this.$route.query?.listed?.toString() === 'true'
    this.searchQuery.priceMin = Number(this.$route.query?.min) || undefined
    this.searchQuery.priceMax = Number(this.$route.query?.max) || undefined
    this.resetPage()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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

  .sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 72px;
    height: 110vh;
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
      border: 1px solid $black;
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
          font-size: 12px;
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
          bottom: 0;
          left: 0;
          width: 100%;
          transition: all 0.3s;
          background: #fff;
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
      }
    }
  }
}
</style>
