<template>
  <div>
    <b-loading is-full-page v-model="isLoading" :can-cancel="true"></b-loading>
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
      <GalleryCardList :items="nfts" />
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
import { NFTWithMeta, NFT } from '../service/scheme';
import { fetchNFTMetadata, sanitizeIpfsUrl } from '../utils';
import GalleryCardList from './GalleryCardList.vue'

type NFTType = NFT | NFTWithMeta;

const nftSort = (a: any, b: any) => b._mod - a._mod

const components = { GalleryCardList }

@Component({ components })
export default class Gallery extends Vue {
  private nfts: NFTType[] = [];

  private isLoading: boolean = false;

  public async mounted() {
    const rmrkService = getInstance();

    if (!rmrkService) {
      return;
    }

    this.isLoading = true;

    try {
      this.nfts = await rmrkService.getAllNFTs().then(arr => arr.slice().sort(nftSort));
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

