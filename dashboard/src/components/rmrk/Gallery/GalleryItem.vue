<template>
  <div class="wrapper">
    <div class="tile is-ancestor gallery-item__skeleton">
      <div class="tile is-6 is-vertical is-parent">
        <div class="tile is-child box">
            <b-image
              v-if="imageVisible"
              :src="nft.image || require('@/utils/placeholder.png')"
              :src-fallback="require('@/utils/placeholder.png')"
              alt="Simple image"
              ratio="1by1"
            ></b-image>
          <MediaResolver v-if="nft.animation_url" :class="{ withPicture: imageVisible }" :src="nft.animation_url" :mimeType="mimeType" />
          <Appreciation :accountId="accountId" :currentOwnerId="nft.currentOwner" :nftId="nft.id" />
        </div>
      </div>

      <div class="tile is-vertical is-parent">
        <div class="tile is-child">
          <p class="title">{{ nft.name }}</p>
          <p class="subtitle">In Collection {{ nft.collection }}</p>
          <p><b>Owned by: </b>{{ nft.currentOwner }}</p>
        </div>
        <div class="tile is-child box">
          <p class="title is-4"><b>Actions</b></p>
          <!-- <p class="subtitle is-6"><b>{Coming soon}</b></p> -->
          <AccountSelect label="Account" v-model="accountId" />
          <AvailableActions :accountId="accountId" :currentOwnerId="nft.currentOwner" :price="nft.price" :nftId="nft.id" />
        </div>
        <div class="tile is-child box">
          <p class="title">Description</p>
          <div class="nft-card__index">
            <b># {{ nft.id }}</b>
          </div>
          <b-tag v-if="nft.price" type="is-dark" size="is-medium">
            <Money :value="nft.price" :inline="true" />
          </b-tag>
          <p class="nft-card__owner"><b>name:</b>{{ nft.name }}</p>
          <p class="nft-card__owner">
            <b>collection:</b>{{ nft.collection }}
          </p>
          <p class="nft-card__owner"><b>sn:</b>{{ nft.sn }}</p>
          <p class="nft-card__owner"><b>instance:</b>{{ nft.sn }}</p>
          <p class="nft-card__owner">
            <b>About:</b>{{ nft.description }}
          </p>
          <p><a :href="nft.external_url" >View it on RMRK.app</a></p>
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
import { emptyObject } from '@/utils/empty';
import AccountSelect from '@/components/shared/AccountSelect.vue';
import AvailableActions from './AvailableActions.vue'
import { notificationTypes, showNotification } from '@/utils/notification';
import Money from '@/components/shared/format/Money.vue'
import Appreciation from './Appreciation.vue'
// import MediaResolver from '../Media/MediaResolver.vue'
import api from '@/fetch';
import { resolveMedia } from '../utils'
import { MediaType } from '../types';

type NFTType = NFT | NFTWithMeta;

@Component({
  components: {
    AccountSelect,
    AvailableActions,
    Money,
    Appreciation,
    MediaResolver: () => import('../Media/MediaResolver.vue')
  }
})
export default class GalleryItem extends Vue {
  private id: string = '';
  private accountId: string = '';
  private passsword: string = '';
  private nft: NFTType = emptyObject<NFTType>();
  public mimeType: string = '';
  private imageVisible: boolean = true;

  @Prop() public value!: any;

  private isLoading: boolean = false;

  public async mounted() {
    this.checkId();
    const rmrkService = getInstance();

    if (!rmrkService || !this.id) {
      return;
    }

    this.isLoading = true;

    try {
      const nft = await rmrkService.getNFT(this.id);
      console.log(nft)
      const meta = await fetchNFTMetadata(nft);
      console.log(meta)
      this.nft = { 
        ...nft,
        ...meta,
        image: sanitizeIpfsUrl(meta.image || ''),
        animation_url: sanitizeIpfsUrl(meta.animation_url || ''),
      };
      if (this.nft.animation_url) {
        const { headers } = await api.head(this.nft.animation_url);
        this.mimeType = headers['content-type'];
        const mediaType = resolveMedia(this.mimeType);
        this.imageVisible = ![MediaType.VIDEO, MediaType.IMAGE].some(t => t === mediaType);
      }  
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger)
      console.warn(e);
    }

    this.isLoading = false;
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
  }
}
</script>

<style scoped>
.gallery-item__skeleton {
  width: 95%;
  margin: auto;
}

.withPicture {
  margin: 0.75em 0;
}
</style>
