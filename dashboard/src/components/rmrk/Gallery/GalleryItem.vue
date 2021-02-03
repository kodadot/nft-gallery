<template>
  <div class="wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-6 is-vertical is-parent">
        <div class="tile is-child box">
            <b-image
              :src="nft.image || require('@/utils/placeholder.png')"
              alt="Simple image"
              ratio="1by1"
              rounded
            ></b-image>
        </div>
      </div>

      <div class="tile is-vertical is-parent">
        <div class="tile is-child">
          <p class="title">{{ nft.name }}</p>
          <p class="subtitle">In Collection {{ nft.collection }}</p>
          <p><b>Owned by: </b>{{ nft.currentOwner }}</p>
        </div>

        <div class="card">
          <div class="card-content">
            <p class="title">
              Actions
            </p>
            <p class="subtitle">
              <AccountSelect label="Account" v-model="accountId" />
              <AvailableActions :accountId="accountId" :currentOwnerId="nft.currentOwner" :price="nft.price" :nftId="nft.id" />
            </p>
          </div>
          <footer class="card-footer">
            <p class="card-footer-item">
              <span>
                Share on <a :href="twitterUri">Twitter</a>
              </span>
            </p>
            <p class="card-footer-item">
              <span>
                Share on <a :href="telegramUri">Telegram</a>
              </span>
            </p>
            <p class="card-footer-item">
              <span>
                Share on <a :href="LinemeUri">Line.me</a>
              </span>
            </p>
          </footer>
        </div>
  
        <div class="tile is-child box">
          <p class="title is-4"><b>Actions</b></p>
          <p class="subtitle is-6"><b>{Coming soon}</b></p>
          
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

type NFTType = NFT | NFTWithMeta;

@Component({
  components: {
    AccountSelect,
    AvailableActions,
    Money
  }
})
export default class GalleryItem extends Vue {
  private id: string = '';
  private accountId: string = '';
  private passsword: string = '';
  private nft: NFTType = emptyObject<NFTType>();

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
      this.nft = { ...nft, ...meta, image: sanitizeIpfsUrl(meta.image || '') };
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

  get helloText() {
    return 'Check this cool RMRK NFT!'
  }

  get realworldFullPath() {
    return `${window.location.origin}/#${this.$route.fullPath}`
  }

  get telegramUri() {
    return `tg://msg_url?url=${this.realworldFullPath}&text=${this.helloText}`
  }

  get twitterUri() {
    return `https://twitter.com/intent/tweet?url=${this.realworldFullPath}&text=${this.helloText}`
  }

  get LinemeUri() {
    return `https://lineit.line.me/share/ui?url=${this.realworldFullPath}&text=${this.helloText}`
  }
 }
</script>

<style scoped>
.gallery-item__skeleton {
  width: 80%;
  margin: auto;
}
</style>
