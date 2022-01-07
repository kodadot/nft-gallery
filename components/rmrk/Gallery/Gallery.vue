<template>
  <div class="gallery container">
    <Loader :value="isLoading" />
    <!-- TODO: Make it work with graphql -->
    <Search v-bind.sync="searchQuery">
      <b-field class="column">
        <Pagination hasMagicBtn simple :total="total" v-model="currentValue" :perPage="first" replace class="is-right remove-margin" />
      </b-field>
    </Search>
    <!-- <b-button @click="first += 1">Show {{ first }}</b-button> -->

    <div>
      <div class="columns is-multiline">
        <div class="column is-4" v-for="nft in results" :key="nft.id">
          <div class="card nft-card">
            <nuxt-link
              :to="`/${urlPrefix}/gallery/${nft.id}`"
              class="nft-card__skeleton"
            >
              <div class="card-image">
                <span v-if="nft.emoteCount" class="card-image__emotes">
                  <b-icon icon="heart" />
                  <span class="card-image__emotes__count">{{
                    nft.emoteCount
                  }}</span>
                </span>
                <BasicImage :src="nft.image" :alt="nft.name" customClass="gallery__image-wrapper" />
                <span v-if="nft.price > 0 && !hidePriceValue" class="card-image__price">
                  <Money :value="nft.price" inline />
                </span>
              </div>

              <div class="card-content">
                <span
                  v-if="!isLoading"
                  class="title mb-0 is-4 has-text-centered"
                  id="hover-title"
                  :title="nft.name"
                >
                  <nuxt-link
                    :to="`/${urlPrefix}/gallery/${nft.id}`"
                  >
                    <div class="has-text-overflow-ellipsis">
                      {{ nft.name }}
                    </div>
                  </nuxt-link>
                  <p
                    v-if="nft.count > 2"
                    :title="`${nft.count} items available in collection`"
                    class="is-absolute nft-collection-counter title is-6"
                  >
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
      replace
    />
  </div>
</template>

<script lang="ts" >
import { Component, Vue, mixins } from 'nuxt-property-decorator'

import { NFTWithMeta, NFT, Metadata, NFTMetadata } from '../service/scheme'
import { fetchMetadata, fetchNFTMetadata, getSanitizer } from '../utils'
import Freezeframe from 'freezeframe'
import 'lazysizes'
import { SearchQuery } from './Search/types'

import { getMany, update } from 'idb-keyval'
import { denyList, statemineDenyList } from '@/utils/constants'
import { DocumentNode } from 'graphql'
import { NFTWithCollectionMeta } from 'components/unique/graphqlResponseTypes'
import PrefixMixin from '~/utils/mixins/prefixMixin'

interface Image extends HTMLImageElement {
  ffInitialized: boolean;
}

const controlFilters = [{ name: { notLikeInsensitive: '%Penis%' } }]

type SearchedNftsWithMeta = NFTWithCollectionMeta & NFTMetadata;
const components = {
  GalleryCardList: () => import('./GalleryCardList.vue'),
  Search: () => import('./Search/SearchBar.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Pagination: () => import('./Pagination.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
}

@Component<Gallery>({
  components,
  name: 'Gallery',
})
export default class Gallery extends mixins(PrefixMixin) {
  private nfts: NFTWithCollectionMeta[] = []
  private meta: Metadata[] = []
  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: 'BLOCK_NUMBER_DESC',
    listed: false,
  }
  private placeholder = '/Kodadot_logo.svg'
  private currentValue = 1
  private total = 0
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


  get hidePriceValue(): boolean {
    return this.$store.getters['preferences/getHidePriceValue']
  }

  public async created() {
    const isRemark = this.urlPrefix === 'rmrk'
    const query = isRemark ? await import('@/queries/nftListWithSearch.graphql') : await import('@/queries/unique/nftListWithSearch.graphql')

    this.$apollo.addSmartQuery('nfts', {
      query:  query as unknown as DocumentNode,
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
          search: this.buildSearchParam()
        }
      }
    })
  }

  protected async handleResult({ data }: any) {
    this.total = data.nFTEntities.totalCount
    this.nfts = data.nFTEntities.nodes.map((e: any) => ({
      ...e,
      emoteCount: e?.emotes?.totalCount
    }))

    const metadataList: string[] = this.nfts.map(({ metadata, collection }: NFTWithCollectionMeta) => metadata || collection.metadata)
    const storedMetadata = await getMany(metadataList).catch(() => metadataList)

    storedMetadata.forEach(async (m, i) => {
      if (!m) {
        try {
          const meta = await fetchNFTMetadata(this.nfts[i], getSanitizer(this.nfts[i].metadata, undefined, 'permafrost'))
          Vue.set(this.nfts, i, {
            ...this.nfts[i],
            ...meta,
            image: getSanitizer(meta.image || '')(meta.image || '')
          })
          update(this.nfts[i].metadata, () => meta)
        } catch (e) {
          console.warn('[ERR] unable to get metadata')
        }
      } else {
        Vue.set(this.nfts, i, {
          ...this.nfts[i],
          ...m,
          image: getSanitizer(m.image || '')(m.image || '')
        })
      }
    })


    // this.prefetchPage(this.offset + this.first, this.offset + (3 * this.first))
  }


  public async prefetchPage(offset: number, prefetchLimit: number) {
    try {
      const isRemark = this.urlPrefix === 'rmrk'
      const query = isRemark ? await import('@/queries/nftListWithSearch.graphql') : await import('@/queries/unique/nftListWithSearch.graphql')
      const nfts = this.$apollo.query({
        query:  query as unknown as DocumentNode,
        client: this.urlPrefix,
        variables: {
          first: this.first,
          offset,
          denyList: isRemark ? denyList : statemineDenyList,
          orderBy: this.searchQuery.sortBy,
          search: this.buildSearchParam()
        }
      })

      const {
        data: {
          nFTEntities: { nodes: nftList }
        }
      } = await nfts

      const metadataList: string[] = this.nfts.map(({ metadata, collection }: NFTWithCollectionMeta) => metadata || collection.metadata)

      const storedPromise = getMany(metadataList).catch(() => metadataList)

      const storedMetadata = await storedPromise

      storedMetadata.forEach(async (m, i) => {
        if (!m) {
          try {
            const meta = await fetchNFTMetadata(nftList[i])
            update(nftList[i].metadata, () => meta)
          } catch (e) {
            console.warn('[ERR] unable to get metadata')
          }
        }
      })
    } catch (e: any) {
      console.warn('[PREFETCH] Unable fo fetch', offset, e.message)
    } finally {
      if (offset <= prefetchLimit) {
        this.prefetchPage(offset + this.first, prefetchLimit)
      }
    }

  }

  private buildSearchParam(): Record<string, unknown>[] {
    const params: any[] = []

    // if (this.searchQuery.search) {
    //   params.push({
    //     name: { likeInsensitive: `%${this.searchQuery.search}%` }
    //   })
    // }

    if (this.searchQuery.listed) {
      params.push({
        price: { greaterThan: '0' }
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

  setFreezeframe() {
    document.addEventListener('lazybeforeunveil', async e => {
      const target = e.target as Image
      const type = target.dataset.type as string
      const isGif = type === 'image/gif'

      if (isGif && !target.ffInitialized) {
        const ff = new Freezeframe(target, {
          trigger: false,
          overlay: true,
          warnings: false
        })

        target.ffInitialized = true
      }
    })
  }

  onError(e: Event) {
    const target = e.target as Image
    target.src = this.placeholder
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.card-image__burned {
  filter: blur(7px);
}

.remove-margin nav  {
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

  .ff-container {
    position: absolute;
    top: 0;
    height: 100%;
    overflow: hidden;

    .ff-overlay {
      z-index: 2;
    }

    .ff-image,
    .ff-canvas {
      top: 50%;
      height: auto;
      transform: translateY(-50%);
      transition: all 0.3s !important;
    }
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
        .ff-canvas {
          border-radius: 8px;
        }

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

        &:hover .ff-canvas {
          transform: scale(1.1);
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
