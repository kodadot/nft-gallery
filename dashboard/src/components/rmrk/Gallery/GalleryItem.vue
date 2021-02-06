<template>
  <div class="wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-6 is-vertical is-parent">
        <div class="tile is-child box">
            <b-image
              v-if="imageVisible"
              :src="nft.image || require('@/assets/kodadot_logo_v1_transparent_400px.png')"
              :src-fallback="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
              alt="Simple image"
              ratio="1by1"
            ></b-image>
          <MediaResolver v-if="nft.animation_url" :class="{ withPicture: imageVisible }" :src="nft.animation_url" :mimeType="mimeType" />
          <Appreciation :accountId="accountId" :currentOwnerId="nft.currentOwner" :nftId="nft.id" />
            <div class="card">
              <div class="card-content">
                <p class="title">
                  Legend
                </p>
                <p class="subtitle is-size-6">
                  <b># {{ nftId }}</b>
                  <b-tag v-if="nft.price" type="is-dark" size="is-medium">
                    <Money :value="nft.price" :inline="true" />
                  </b-tag>
                  <p class="subtitle is-size-6">
                    {{ nft.description }}
                  </p>
                  <!-- <p><a :href="nft.external_url" >View it on RMRK.app</a></p> -->
                </p>
              </div>
            </div>
        </div>
      </div>

      <div class="tile is-vertical is-parent">
        <div class="card">
          <div class="card-content">
            <p class="title">
              {{ nft.name }}
            </p>
            <p class="title is-size-4">
              Collection
            </p>
            <p class="subtitle is-size-6"> 
              {{ nft.collection }}
            </p>
            <p class="title is-size-4">
              Owner
            </p>
            <p class="subtitle is-size-6">
              {{ nft.currentOwner }}
            </p>
          </div>
        </div>
        <br/>
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
                <a :href="twitterUri">
                  <b-icon 
                    size="is-large"
                    pack="fab" 
                    icon="twitter">
                  </b-icon>
                </a>
              </span>
            </p>
            <p class="card-footer-item">
              <span>
                <a :href="telegramUri">
                  <b-icon 
                    size="is-large"
                    pack="fab" 
                    icon="telegram">
                  </b-icon>
                </a>
              </span>
            </p>
            <p class="card-footer-item">
              <span>
                <a :href="linemeUri">
                  <b-icon 
                    size="is-large"
                    pack="fab" 
                    icon="line">
                  </b-icon>
                </a>
              </span>
            </p>
          </footer>
        </div>
      <br>


        <b-collapse class="card" animation="slide" 
          aria-id="contentIdForA11y3" :open="false">
          <template #trigger="props">
            <div
              class="card-header"
              role="button"
              aria-controls="contentIdForA11y3">
              <p class="card-header-title">
                Facts
              </p>
              <a class="card-header-icon">
                  <b-icon
                      :icon="props.open ? 'chevron-down' : 'chevron-up'">
                  </b-icon>
              </a>
            </div>
          </template>

          <div class="card-content">
            <div class="content">
              <p class="subtitle is-size-6">
                <b>COLLECTION:</b>{{ nft.collection }}
              </p>
              <p class="subtitle is-size-6">
                <b>SN:</b>{{ nft.sn }}
              </p>
              <p class="subtitle is-size-6">
                <b>INSTANCE:</b>{{ nft.sn }}
              </p>
            </div>
          </div>
        </b-collapse>
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
import AvailableActions from './AvailableActions.vue';
import { notificationTypes, showNotification } from '@/utils/notification';
import Money from '@/components/shared/format/Money.vue';
import Appreciation from './Appreciation.vue';
// import MediaResolver from '../Media/MediaResolver.vue'
import api from '@/fetch';
import { resolveMedia } from '../utils';
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
      console.log(nft);
      const meta = await fetchNFTMetadata(nft);
      console.log(meta);
      this.nft = {
        ...nft,
        ...meta,
        image: sanitizeIpfsUrl(meta.image || ''),
        animation_url: sanitizeIpfsUrl(meta.animation_url || '')
      };
      if (this.nft.animation_url) {
        const { headers } = await api.head(this.nft.animation_url);
        this.mimeType = headers['content-type'];
        const mediaType = resolveMedia(this.mimeType);
        this.imageVisible = ![MediaType.VIDEO, MediaType.IMAGE].some(
          t => t === mediaType
        );
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger);
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
    return 'Check out this cool RMRK NFT';
  }

  get realworldFullPath() {
    return `${window.location.origin}/%23${this.$route.fullPath}`;
  }

  get telegramUri() {
    return `tg://msg_url?url=${this.realworldFullPath}&text=${this.helloText}`;
  }

  get twitterUri() {
    return `https://twitter.com/intent/tweet?text=${this.helloText}&via=KodaDot&url=${this.realworldFullPath}`;
  }

  get linemeUri() {
    return `https://lineit.line.me/share/ui?url=${this.realworldFullPath}&text=${this.helloText}`;
  }

  get nftId() {
    const { id, blockNumber } = this.nft;
    return `${blockNumber ? blockNumber + '-' : ''}${id}`;
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
