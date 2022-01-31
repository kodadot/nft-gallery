<template>
  <div class="gallery container">
    <Loader :value="isLoading" />
    <!-- TODO: Make it work with graphql -->
    <Search v-bind.sync="searchQuery">
      <Pagination
        hasMagicBtn
        simple
        :total="total"
        v-model="currentValue"
        :perPage="first"
        replace
        class="remove-margin" />
    </Search>
    <!-- <b-button @click="first += 1">Show {{ first }}</b-button> -->

    <div>
      <div class="columns is-multiline">
        <div class="column is-4" v-for="nft in results" :key="nft.id">
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
    </div>
    <Pagination
      class="pt-5 pb-5"
      :total="total"
      :perPage="first"
      v-model="currentValue"
      replace />
  </div>
</template>

<script lang="ts">
import { Component, mixins, Vue } from 'nuxt-property-decorator'
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

import PrefixMixin from '~/utils/mixins/prefixMixin'
import { NFTMetadata } from '../service/scheme'
import { getSanitizer } from '../utils'
import { SearchQuery } from './Search/types'

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
}

@Component<Gallery>({
  components,
  name: 'Gallery',
})
export default class Gallery extends mixins(PrefixMixin) {
  private nfts: NFTWithCollectionMeta[] = []
  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: true,
  }
  private currentValue = 1
  protected total = 0
  private loadingState = 0

  get first(): number {
    return this.$store.getters['preferences/getGalleryItemsPerPage']
  }

  get isLoading() {
    return Boolean(this.loadingState)
  }

  get offset() {
    return this.currentValue * this.first - this.first
  }

  get showPriceValue(): boolean {
    return (
      this.searchQuery?.listed ||
      this.$store.getters['preferences/getShowPriceValue']
    )
  }

  get getLoadAllArtwork(): boolean {
    return this.$store.getters['preferences/getLoadAllArtwork']
  }

  public async created() {
    const isRemark = this.urlPrefix === 'rmrk'
    const query = isRemark
      ? await import('@/queries/nftListWithSearch.graphql')
      : await import('@/queries/unique/nftListWithSearch.graphql')

    this.$apollo.addSmartQuery<GraphResponse>('nfts', {
      query: query.default,
      manual: true,
      // update: ({ nFTEntities }) => nFTEntities.nodes,
      loadingKey: 'loadingState',
      client: this.urlPrefix,
      result: this.handleResult,
      variables: () => {
        return {
          first: this.first,
          offset: this.offset,
          denyList: isRemark ? denyList : statemineDenyList,
          orderBy: this.searchQuery.sortBy,
          search: this.buildSearchParam(),
        }
      },
    })
  }

  protected async handleResult({ data }: WithData<GraphResponse>) {
    this.total = data.nFTEntities.totalCount
    this.nfts = data.nFTEntities.nodes.map((e: any) => ({
      ...e,
      emoteCount: e?.emotes?.totalCount,
    }))

    const metadataList: string[] = this.nfts.map(mapNFTorCollectionMetadata)
    const imageLinks = await getCloudflareImageLinks(metadataList)

    processMetadata<NFTMetadata>(metadataList, (meta, i) => {
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

    this.prefetchPage(this.offset + this.first, this.offset + 3 * this.first)
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
        },
      })

      const {
        data: {
          nFTEntities: { nodes: nftList },
        },
      } = await nfts

      const metadataList: string[] = nftList.map(mapNFTorCollectionMetadata)
      processMetadata<NFTMetadata>(metadataList)
    } catch (e) {
      logError(e, (msg) =>
        console.warn('[PREFETCH] Unable fo fetch', offset, msg)
      )
    } finally {
      if (offset <= prefetchLimit) {
        this.prefetchPage(offset + this.first, prefetchLimit)
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

    if (this.searchQuery.listed) {
      params.push({
        price: { greaterThan: '0' },
      })
    }

    return params
  }

  get results() {
    // if (this.searchQuery) {
    //   return basicAggQuery(expandedFilter(this.searchQuery, this.nfts))
    // }

    return this.nfts as SearchedNftsWithMeta[]

    // return basicAggQuery(expandedFilter(this.searchQuery, this.nfts));
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
  &__image-wrapper {
    position: relative;
    margin: auto;
    padding-top: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  .card-image img {
    border-radius: 8px;
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
    padding-top: 10px;

    .card {
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 2px solid $primary-light;

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
          background: #000;
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
