<template>
  <div>
    <div class="nft-gallery__title">RMRK NFT Gallery</div>
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
    <div class="columns is-multiline ">
      <div
        class="column is-one-quarter-desktop is-one-third-tablet card nft-card "
        v-for="nft in nfts"
        :key="nft.id"
      >
        <div class="card-image" v-if="nft.image">
          <b-image
            :src="nft.image"
            alt="Simple image"
            ratio="1by1"
            rounded
          ></b-image>
        </div>

        <div class="card-content">
          <b-tag type="is-primary" size="is-medium">{{ nft.symbol }}</b-tag>
          <div class="nft-card__index"><b># {{ nft.id }}</b></div>
          <div><b>Collection:</b>{{ nft.name }}</div>
          <div class="nft-card__owner"><b>Max:</b>{{ nft.max }}</div>
          <div class="nft-card__owner"><b>Owner:</b>{{ nft.issuer }}</div>
          <div class="nft-card__owner"><b>Description:</b>{{ nft.description }}</div>
          
          <!-- <b-taglist v-if="token.attributes">
            <b-tag
              type="is-dark"
              size="is-medium"
              v-for="attr in token.attributes"
              :key="attr"
            >
              {{ attr }}
            </b-tag>
          </b-taglist> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { NFTWithMeta, NFT } from '../service/scheme';
import { getInstance } from '@/components/rmrk/service/RmrkService'
import { fetchNFTMetadata, sanitizeIpfsUrl } from '../utils';

type NFTType = NFT | NFTWithMeta;

const shouldUpdate = (val: string, oldVal: string) => val && (val !== oldVal)

@Component({})
export default class NFTList extends Vue {

  private nfts: NFTType[] = [];
  private isLoading: boolean = false;
  @Prop() public collectionId!: string;

  @Watch('collectionId')
  onCollectionUpdate(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      const rmrkService = getInstance()
      
    }
  }

  async fetchNFTsForCollection(id: string) {
    const rmrkService = getInstance()

    if (!rmrkService) {
      return
    }

    this.isLoading = true

    try {
      this.nfts = await rmrkService.getNFTsForCollection(id);
      this.nftMeta();

    } catch (e) {
      console.warn(e)
    }

    this.isLoading = false;
  }

    nftMeta() {
    this.nfts.map(fetchNFTMetadata).forEach(async (call, index) => {
      const res = await call
      Vue.set(this.nfts, index, {...this.nfts[index], ...res, image: sanitizeIpfsUrl(res.image || '')})
    })

    
  }




}
</script>
