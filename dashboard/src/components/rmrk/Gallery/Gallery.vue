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
      <div class="columns is-multiline">
        <div
          class="column is-one-quarter-desktop is-one-third-tablet"
          v-for="nft in nfts"
          :key="nft.id"
        >
          <div class="card nft-card">
            <router-link :to="`/nft/detail/${nft.id}`" tag="div" class="nft-card__skeleton">
              <div class="card-image" v-if="nft.image">
                <b-image
                  :src="nft.image"
                  alt="Simple image"
                  ratio="1by1"
                  rounded
                ></b-image>
              </div>

              <div v-else class="card-image">
                <b-image
                  :src="require('@/utils/placeholder.png')"
                  alt="Simple image"
                  ratio="1by1"
                  rounded
                ></b-image>
              </div>

              <div class="card-content">
                <p class="subtitle is-6">{{ nft.collection }}</p>
                <p class="title is-4">{{ nft.name }}</p>
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
import { fetchNFTMetadata, sanitizeIpfsUrl } from '../utils';

type NFTType = NFT | NFTWithMeta;

@Component({})
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
      this.nfts = await rmrkService.getAllNFTs();
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

<style scoped>
.card.nft-card {
  padding: 1em !important;
  height: 100%;
}
.nft-card__skeleton {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.nft-card__owner {
  word-break: break-word;
}
.nft-card__index {
  font-size: 1.35em;
  font-weight: bold;
}
</style>
