<template>
  <div>
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
    <Search :query.sync="searchQuery" />
    <div>
      <div class="columns is-multiline">
        <div
          class="column is-4"
          v-for="nft in results"
          :key="nft.id"
        >
          <div class="card nft-card">
            <router-link :to="{ name: 'nftDetail', params: { id: nft.id }}" tag="div" class="nft-card__skeleton">
              <div class="card-image" v-if="nft.image">
                <b-skeleton
                  height="240px"
                  :active="isLoading">
                </b-skeleton>
                <b-image
                  v-if="!isLoading"
                  :src="nft.image"
                  :src-fallback="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
                  alt="Simple image"
                  ratio="1by1"
                ></b-image>
              </div>

              <div v-else class="card-image">
                <b-image
                  :src="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
                  alt="Simple image"
                  ratio="1by1"
                ></b-image>
              </div>

              <div class="card-content">
                <p
                  v-if="!isLoading"
                  class="title is-4 has-text-centered">
                  <router-link v-if="nft.count < 2" :to="{ name: 'nftDetail', params: { id: nft.id }}">
                    {{ nft.name }}
                  </router-link>
                  <router-link v-else :to="{ name: 'collectionDetail', params: { id: nft.collection }}">
                    {{ nft.name }} 「{{ nft.count }}」
                  </router-link>
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
import { defaultSortBy, sanitizeObjectArray } from '../utils';
import GalleryCardList from './GalleryCardList.vue'
import Search from './Search/SearchBar.vue'
import { basicFilter, basicAggQuery } from './Search/query'

type NFTType = NFTWithMeta;
const components = { GalleryCardList, Search }

@Component({ components })
export default class Gallery extends Vue {
  private nfts: NFTType[] = [];
  private isLoading: boolean = true;
  private searchQuery = ''

  public async mounted() {
    const rmrkService = getInstance();

    if (!rmrkService) {
      return;
    }

    try {
      this.nfts = await rmrkService.getAllNFTs()
      .then(sanitizeObjectArray)
      .then(defaultSortBy);
      // this.collectionMeta();
    } catch (e) {
      console.warn(e);
    }

    this.isLoading = false;
  }

  get results() {
    if (this.searchQuery) {
      return basicAggQuery(basicFilter(this.searchQuery, this.nfts))
    }

    return basicAggQuery(this.nfts)
  }

}
</script>

