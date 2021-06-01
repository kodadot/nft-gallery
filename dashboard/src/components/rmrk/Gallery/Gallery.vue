<template>
  <div class="gallery">
    <!-- TODO: Make it work with graphql -->
    <!-- <Search v-bind.sync="searchQuery" /> -->
    <b-button @click="first += 1">Show {{ first }}</b-button>
    <Pagination simple  :total="total" v-model="currentValue" replace />
    <div>
      <div class="columns is-multiline">
        <div
          class="column is-4"
          v-for="(nft) in results"
          :key="nft.id"
        >
          <div class="card nft-card">
            <router-link :to="{ name: 'nftDetail', params: { id: nft.id }}" tag="div" class="nft-card__skeleton">
              <div class="card-image">
                <span v-if="nft.emoteCount" class="card-image__emotes">{{nft.emoteCount}}</span>
                <figure class="gallery__image-wrapper">
                  <img
                    :src="placeholder"
                    :data-src="nft.image"
                    :data-type="nft.type"
                    :alt="nft.name"
                    class="lazyload gallery__image"
                    @error="onError"
                  />
                </figure>
                <span
                  v-if="nft.price"
                  class="card-image__price"
                >
                    <Money
                      :value="nft.price"
                      showFiatValue="usd"
                      inline
                    />
                </span>
              </div>

              <div class="card-content">
                <span
                  v-if="!isLoading"
                  class="title mb-0 is-4 has-text-centered"
                  :title="nft.name">
                  <router-link v-if="nft.count < 2" :to="{ name: 'nftDetail', params: { id: nft.id }}">
                    <div>
                      <div class="has-text-overflow-ellipsis middle">
                        {{ nft.name }}
                      </div>
                    </div>
                  </router-link>
                  <router-link v-else :to="{ name: 'collectionDetail', params: { id: nft.collection }}">

                    <div class="has-text-overflow-ellipsis">
                      {{ nft.name }}
                    </div>
                  </router-link>

                  <p
                    v-if="nft.count > 2"
                    :title="`${nft.count} items available in collection`"
                    class="is-absolute nft-collection-counter title is-6 is-color-pink"
                  >
                    「{{ nft.count }}」
                  </p>

                </span>
                <b-skeleton
                  :active="isLoading">
                </b-skeleton>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <Pagination class="pt-5 pb-5"  :total="total" v-model="currentValue" replace />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { NFTWithMeta, NFT, Metadata } from '../service/scheme';
import { defaultSortBy, sanitizeObjectArray, mapPriceToNumber, fetchNFTMetadata, sanitizeIpfsUrl } from '../utils';
import { basicFilter, basicAggQuery, expandedFilter } from './Search/query'
import Freezeframe from 'freezeframe'
import 'lazysizes'
import { SearchQuery } from './Search/types';
import nftList from '@/queries/nftList.graphql'
import { set, get, getMany, update } from 'idb-keyval';
import axios from 'axios';

interface Image extends HTMLImageElement {
  ffInitialized: boolean
}

type NFTType = NFTWithMeta;
const components = {
  GalleryCardList: () => import('./GalleryCardList.vue'),
  Search: () => import('./Search/SearchBar.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Pagination: () => import('./Pagination.vue')
}

@Component<Gallery>({
  metaInfo() {
    return {
      meta: [
        { property: 'og:title', content: 'Low minting fees and carbonless NFTs'},
        { property: 'og:image', content: 'https://nft.kodadot.xyz/kodadot_gallery.jpg'},
        { property: 'og:description', content: 'Buy Carbonless NFTs on Kusama'},
        { property: 'twitter:title', content: 'Low minting fees and carbonless NFTs'},
        { property: 'twitter:description', content: 'Buy Carbonless NFTs on Kusama'},
        { property: 'twitter:image', content: 'https://nft.kodadot.xyz/kodadot_gallery.jpg'},
      ]
    }
  },
  components })
export default class Gallery extends Vue {
  private nfts: NFT[] = [];
  private meta: Metadata[] = [];
  private isLoading: boolean = false;
  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: { blockNumber: -1 }
  }
  private first = 30;
  private placeholder = require('@/assets/kodadot_logo_v1_transparent_400px.png')
  private currentValue = 1
  private total = 0;

  // public mounted() {
  //   window.onscroll = () => {
  //     const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.scrollHeight;
  //     if (bottomOfWindow) {
  //       console.log('!!!!!!!!!!!!!!!! [END]')
  //     }
  //   }
  // }

  get offset() {
    return (this.currentValue * this.first) - this.first
  }

  public async created() {
    this.isLoading = true
    // const rmrkService = getInstance();

    // this.setFreezeframe()

    // if (!rmrkService) {
    //   this.isLoading = false;
    //   return;
    // }

    // const ap = await this.$apollo.query<NFT>({
    //   query: nftList
    // })

    const a = this.$apollo.addSmartQuery('nfts',{
      query: nftList,
      manual: true,
      // update: ({ nFTEntities }) => nFTEntities.nodes,
      loadingKey: 'isLoading',
      result: this.handleResult,
      variables: () => {
        return {
          first: this.first,
          offset: this.offset
        }
      },
    })

    console.log(a)


    // try {
    //   this.nfts = await rmrkService.getAllNFTs()
    //   .then(sanitizeObjectArray)
    //   .then(mapPriceToNumber)
    //   .then(defaultSortBy);

    //   // this.collectionMeta();
    // } catch (e) {
    //   console.warn(e);
    // }
    this.isLoading = false;
  }

  protected async handleResult({ data }: any) {
    this.total =  data.nFTEntities.totalCount;
    this.nfts = basicAggQuery(data.nFTEntities.nodes) as unknown as NFT[];
    console.log(this.nfts);

    const storedMetadata = await getMany(this.nfts.map(({ metadata }: any) => metadata))
    storedMetadata.forEach(async (m, i) => {
      if (!m) {
        try {
          const meta = await fetchNFTMetadata(this.nfts[i])
          Vue.set(this.nfts, i, {...this.nfts[i], ...meta, image: sanitizeIpfsUrl(meta.image || '')})
          update(this.nfts[i].metadata, () => meta)
        } catch (e) {
          console.warn('[ERR] unable to get metadata')
        }
      } else {
        Vue.set(this.nfts, i, {...this.nfts[i], ...m, image: sanitizeIpfsUrl(m.image || '')})
      }
    })
  }

  get results() {
    // if (this.searchQuery) {
    //   return basicAggQuery(expandedFilter(this.searchQuery, this.nfts))
    // }

    return this.nfts

    // return basicAggQuery(expandedFilter(this.searchQuery, this.nfts));
  }

  setFreezeframe() {
    document.addEventListener('lazybeforeunveil', async (e) => {
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
.gallery {

  @media screen and (max-width: 1023px){
    padding: 0 15px;
  }

  &__image-wrapper {
    position: relative;
    margin: auto;
    padding-top: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  &__image {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    border-radius: 8px;
    top: 50%;
    transition: all 0.3s;
    display: block;
    width: 100%;
    height: auto;
    transform: scale(1) translateY(-50%);
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
  }

  .is-float-right{
    float: right;
  }

  .is-color-pink {
    color: #d32e79;
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

      &-image {
        .ff-canvas {
          border-radius: 8px;
        }

        &__emotes {
          position: absolute;
          background-color: #d32e79;
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
          background-color: #363636;
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

      @media screen and (min-width: 1024px){
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
        }

        &:hover .gallery__image-wrapper img {
          transform: scale(1.1) translateY(-50%);
        }

        &:hover .ff-canvas {
          transform: scale(1.1) translateY(-50%);
        }

        &:hover .card-image__emotes {
          top: 15px;
          right: 15px;
        }

        &:hover  .card-image__price {
          bottom: 62px;
        }
      }
    }
  }
}
</style>
