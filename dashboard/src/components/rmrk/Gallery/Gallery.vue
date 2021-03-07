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
          class="column is-4"
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
                  :src-fallback="require('@/utils/placeholder.png')"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { NFTWithMeta, NFT } from '../service/scheme';
import { fetchNFTMetadata, sanitizeIpfsUrl, defaultSortBy } from '../utils';
import GalleryCardList from './GalleryCardList.vue'

type NFTType = NFT | NFTWithMeta;
const components = { GalleryCardList }

@Component({ components })
export default class Gallery extends Vue {
  private nfts: NFTType[] = [];
  private isLoading: boolean = true;

  public async mounted() {
    const rmrkService = getInstance();

    if (!rmrkService) {
      return;
    }

    try {
      this.nfts = await rmrkService.getAllNFTs().then(defaultSortBy);
      this.collectionMeta();
    } catch (e) {
      console.warn(e);
    }

    this.isLoading = false;
  }

  collectionMeta() {
    this.nfts.map(fetchNFTMetadata).forEach(async (call, index) => {
      const res = await call;
      Vue.set(this.nfts, index, {
        ...this.nfts[index],
        ...res,
        image: sanitizeIpfsUrl(res.image || '')
      });
    });
  }
}
</script>

