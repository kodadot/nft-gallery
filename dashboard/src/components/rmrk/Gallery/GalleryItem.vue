<template>
  <div class="wrapper">
    <div class="tile is-ancestor">
      <div class="tile is-6 is-vertical is-parent">
        <div class="tile is-child box">
            <b-image
              v-if="imageVisible"
              :src="nft.image || require('@/assets/kodadot_logo_v1_transparent_400px.png')"
              :src-fallback="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
              alt="NFT minted image"
              ratio="1by1"
            ></b-image>
          <MediaResolver v-if="nft.animation_url" :class="{ withPicture: imageVisible }" :src="nft.animation_url" :mimeType="mimeType" />
          <Appreciation :accountId="accountId" :currentOwnerId="nft.currentOwner" :nftId="nft.id" />
            <div class="card">
              <div class="card-content">
                <p class="title is-size-2">
                  {{ $t('legend')}}
                </p>
                <p class="subtitle is-size-7">
                  <b># {{ nftId }}</b>
                  <b-tag v-if="nft.price" type="is-dark" size="is-medium">
                    <Money :value="nft.price" :inline="true" />
                  </b-tag>
                  <p class="subtitle is-size-5">
                    {{ nft.description }}
                  </p>
                </p>
              </div>
            </div>
        </div>
      </div>

      <div class="tile is-vertical is-parent">
        <b-collapse class="card" animation="slide" 
          aria-id="contentIdForA11y3" :open="false">
          <template #trigger="props">
            <div
              class="card-header"
              role="button"
              aria-controls="contentIdForA11y3">
              <p class="card-header-title is-size-1">
                {{ nft.name }}
              </p>
              <a class="card-header-icon">
                <b-icon
                  :icon="props.open ? 'chevron-up' : 'chevron-down'">
                </b-icon>
              </a>
            </div>
          </template>
          <div class="card-content">
            <div class="content">
              <p class="title is-size-4">
                {{ $t('collection') }}
              </p>
              <p class="subtitle is-size-6"> 
                {{ nft.collection }}
              </p>
              <p class="title is-size-4">
                {{ $t('owner') }}
              </p>
              <p class="subtitle is-size-7">
                <a :href="`https://kusama.subscan.io/account/${nft.currentOwner}`" target="_blank">{{ nft.currentOwner }}</a>
              </p>
            </div>
          </div>
        </b-collapse>
        <br>
        
        <b-collapse class="card" animation="slide" 
          aria-id="contentIdForA11y3" :open="false">
          <template #trigger="props">
            <div
              class="card-header"
              role="button"
              aria-controls="contentIdForA11y3">
              <p class="card-header-title">
                {{ $t('actions') }}
              </p>
              <a class="card-header-icon">
                <b-icon
                  :icon="props.open ? 'chevron-up' : 'chevron-down'">
                </b-icon>
              </a>
            </div>
          </template>
          <div class="card-content">
            <div class="content">
              <p class="subtitle">
                <AccountSelect label="Account" v-model="accountId" />
                <AvailableActions :accountId="accountId" :currentOwnerId="nft.currentOwner" :price="nft.price" :nftId="nft.id" />
              </p>
            </div>
          </div>
        </b-collapse>

        <div class="card">
          <footer class="card-footer">
            <p class="card-footer-item">
              <span>
                <a :href="twitterUri"
                    target="_blank">
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
                <a :href="telegramUri"
                    target="_blank">
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
                <a :href="linemeUri"
                    target="_blank">
                  <b-icon 
                    size="is-large"
                    pack="fab" 
                    icon="line">
                  </b-icon>
                </a>
              </span>
            </p>
            <p class="card-footer-item">
              <span>
                <a 
                  v-clipboard:copy="realworldFullPathShare"
                  @click="toast('URL copied to clipboard')">
                 <b-icon   
                    size="is-medium"
                    pack="fas" 
                    icon="link">
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
                {{ $t('facts') }}
              </p>
              <a class="card-header-icon">
                <b-icon
                  :icon="props.open ? 'chevron-up' : 'chevron-down'">
                </b-icon>
              </a>
            </div>
          </template>

          <div class="card-content">
            <div class="content">
              <p class="subtitle is-size-6">
                <b>{{ $t('collection') }}:</b>{{ nft.collection }}
              </p>
              <p class="subtitle is-size-6">
                <b>SN:</b>{{ nft.sn }}
              </p>
              <p class="subtitle is-size-6">
                <b>{{ $t('instance') }}:</b>{{ nft.sn }}
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
import { MetaInfo } from 'vue-meta';

type NFTType =  NFTWithMeta;

@Component<GalleryItem>({
  metaInfo() {
    return {
      meta: [
        { 
          vmid: 'description',
          name: 'description',
          content: 'KodaDot 🖼👀 First Polkadot/Kusama NFT Market Explorer'
        },
        { property: 'og:type', content: 'website'},
        { property: 'og:title', content: (this.nft.name as string) },
        { property: 'og:description', content: (this.nft.description as string) },
        { property: 'og:image', content: (this.nft.image as string) },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:site', content: '@KodaDot' },
        { property: 'twitter:title', content: (this.nft.name as string) },
        { property: 'twitter:description', content: (this.nft.description as string) },
        { property: 'twitter:image', content: (this.nft.image as string) },
      ]
    }
  },
  components: {
    AccountSelect,
    AvailableActions,
    Money,
    Appreciation,
    MediaResolver: () => import('../Media/MediaResolver.vue'),
  }
})
export default class GalleryItem extends Vue {
  private id: string = '';
  private accountId: string = '';
  private passsword: string = '';
  private nft: NFTType = emptyObject<NFTType>();
  private imageVisible: boolean = true;
  private isLoading: boolean = false;

  @Prop() public value!: any;

  public mimeType: string = '';

  public async mounted() {
    this.checkId();
    const rmrkService = getInstance();
    console.log('rmrkService', rmrkService)
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

  public toast(message: string): void {
    this.$buefy.toast.open(message);
  }

  get helloText() {
    return 'Check out this cool RMRK NFT %23kodadot';
  }

  get realworldFullPath() {
    return `${window.location.origin}${this.$route.fullPath}`;
  }

  get realworldFullPathShare() {
    return `${window.location.origin}${this.$route.fullPath}`;
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
