<template>
  <div class="gallery">
    <!-- <b-field label="Owners">
      <b-select
        placeholder="Select an owner"
        :value="selectedOwner"
        @input="handleOwner"
      >
        <option v-for="option in allOwners" :value="option" :key="option">
          {{ option }}
        </option>
      </b-select>
    </b-field> -->
    <Search v-bind.sync="searchQuery" />
    <div>
      <div class="columns is-multiline">
        <div
          class="column is-4"
          v-for="nft in results"
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
                <p
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

                </p>
                <b-skeleton
                  :active="isLoading">
                </b-skeleton>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { NFTWithMeta, NFT } from '../service/scheme';
import { defaultSortBy, sanitizeObjectArray, mapPriceToNumber } from '../utils';
import GalleryCardList from './GalleryCardList.vue'
import Search from './Search/SearchBar.vue'
import Money from '@/components/shared/format/Money.vue'
import { basicFilter, basicAggQuery, expandedFilter } from './Search/query'
import axios from 'axios'
import Freezeframe from 'freezeframe'
import 'lazysizes'
import { SearchQuery } from './Search/types';

interface Image extends HTMLImageElement {
  ffInitialized: boolean
}

type NFTType = NFTWithMeta;
const components = { GalleryCardList, Search, Money }

@Component({ components })
export default class Gallery extends Vue {
  private nfts: NFTType[] = [];
  private isLoading: boolean = true;
  private searchQuery: SearchQuery = {
    search: '',
    type: '',
    sortBy: { blockNumber: -1 }
  }
  private placeholder = require('@/assets/kodadot_logo_v1_transparent_400px.png')

  public async mounted() {
    const rmrkService = getInstance();

    this.setFreezeframe()

    if (!rmrkService) {
      return;
    }

    try {
      this.nfts = await rmrkService.getAllNFTs()
      .then(sanitizeObjectArray)
      .then(mapPriceToNumber)
      .then(defaultSortBy);

      // this.collectionMeta();
    } catch (e) {
      console.warn(e);
    }
    this.isLoading = false;
  }

  get results() {
    // if (this.searchQuery) {
    //   return basicAggQuery(expandedFilter(this.searchQuery, this.nfts))
    // }

    return basicAggQuery(expandedFilter(this.searchQuery, this.nfts));
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
