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
    <div>
      <div class="columns is-multiline">
        <div
          class="column is-8 is-offset-2"
          v-for="nft in nfts"
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
                  alt="NFT multimedia craft"
                  ratio="1by1"
                ></b-image>
              </div>

              <div v-else class="card-image">
                <b-image
                  :src="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
                  alt="NFT multimedia craft"
                  ratio="1by1"
                ></b-image>
              </div>

              <div class="card-content">
                <p
                  v-if="!isLoading"
                  class="title is-4 has-text-centered">
                  <router-link :to="{ name: 'nftDetail', params: { id: nft.id }}">
                    {{ nft.name }}
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
import { Component, Vue } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { NFTWithMeta, NFT } from '../service/scheme';
import { defaultSortBy, sanitizeObjectArray } from '../utils';
import GalleryCardList from './GalleryCardList.vue'
import Sustainibility from '@/components/landing/Sustainability.vue';

type NFTType = NFT | NFTWithMeta;
const components = { GalleryCardList }

@Component<Sustainibility>({
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
  }, components })
export default class Gallery extends Vue {
  private nfts: NFTType[] = [];
  private isLoading: boolean = true;

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

}
</script>

