 <template>
  <div class="wrapper">
    <div class="columns">
        <div class="image-wrapper">
            <button id="theatre-view" @click="toggleView" v-if="!isLoading && imageVisible">{{ viewMode === 'default' ? $t('theatre') : $t('default') }} {{$t('view')}}</button>
            <div class="column" :class="{ 'is-12': viewMode === 'theatre', 'is-6 is-offset-3': viewMode === 'default'}">
              <div class="image-preview" :class="{fullscreen: isFullScreenView}">
                <b-image
                  v-if="!isLoading && imageVisible"
                  :src="nft.image || require('@/assets/kodadot_logo_v1_transparent_400px.png')"
                  :src-fallback="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
                  alt="KodaDot NFT minted multimedia"
                ></b-image>
                <img class="fullscreen-image" :src="nft.image || require('@/assets/kodadot_logo_v1_transparent_400px.png')" alt="KodaDot NFT minted multimedia">
                <b-skeleton height="524px" size="is-large" :active="isLoading"></b-skeleton>
                <MediaResolver v-if="nft.animation_url" :class="{ withPicture: imageVisible }" :src="nft.animation_url" :mimeType="mimeType" />
              </div>
            </div>
            <button id="fullscreen-view" @click="toggleFullScreen" v-if="!isLoading && imageVisible" :class="{fullscreen: isFullScreenView}">
              <b-icon
                :icon="isFullScreenView ? 'compress-alt' : 'arrows-alt'"
                >
              </b-icon>
            </button>
        </div>
    </div>
    <div class="columns">
      <div class="column is-6">
        <Appreciation :accountId="accountId" :currentOwnerId="nft.currentOwner" :nftId="nft.id" />
        
        <div class="nft-title">
          <Name :nft="nft" :isLoading="isLoading" />
        </div>

        <p class="label">
          {{ $t('legend')}}
        </p>
        
        <div class="subtitle is-size-7">
          <p v-if="!isLoading"
            class="subtitle is-size-5">
            {{ nft.description }}
            <!-- <markdown-it-vue-light class="md-body" :content="nft.description"/> -->
          </p>
          <b-skeleton :count="3" size="is-large" :active="isLoading"></b-skeleton>
        </div>
        
        <template v-if="detailVisible">
          <Facts :nft="nft" />
        </template>
      </div>
      <div class="column is-3 is-offset-3" v-if="detailVisible">
        
        <b-skeleton :count="2" size="is-large" :active="isLoading"></b-skeleton>
        <div class="price-block" v-if="hasPrice">
          <div class="price-block__original">{{ this.nft.price | formatBalance(12, 'KSM') }}</div>
          <!--<div class="label price-block__exchange">{{ this.nft.price | formatBalance(12, 'USD') }}</div>--> <!-- // price in USD -->
          <div class="label">{{ $t('price') }}</div>
        </div>

        <template v-if="detailVisible">
          <PackSaver v-if="accountId" :accountId="accountId" :currentOwnerId="nft.currentOwner" :nftId="nft.id" />
          <b-collapse class="card mb-4" animation="slide"
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
                    <Auth />
                    <AvailableActions
                    :accountId="accountId"
                    :currentOwnerId="nft.currentOwner"
                    :price="nft.price"
                    :nftId="nft.id"
                    :ipfsHashes="[nft.image, nft.animation_url, nft.metadata]"
                    @change="handleAction"
                    />
                  </p>
                </div>
              </div>
          </b-collapse>
        </template>

        <Sharing />
      </div>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
// import MarkdownItVueLight from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
import { NFTWithMeta, NFT } from '../service/scheme';
import { sanitizeIpfsUrl } from '../utils';
import { emptyObject } from '@/utils/empty';
import { formatBalance } from '@polkadot/util';

import AvailableActions from './AvailableActions.vue';
import { notificationTypes, showNotification } from '@/utils/notification';
import Money from '@/components/shared/format/Money.vue';
import Sharing from '@/components/rmrk/Gallery/Item/Sharing.vue';
import Facts from '@/components/rmrk/Gallery/Item/Facts.vue';
import Name from '@/components/rmrk/Gallery/Item/Name.vue';
// import MediaResolver from '../Media/MediaResolver.vue'
import api from '@/fetch';
import { resolveMedia } from '../utils';
import { MediaType } from '../types';
import { MetaInfo } from 'vue-meta';
import isShareMode from '@/utils/isShareMode';
import { VueConstructor } from 'vue';

type NFTType =  NFTWithMeta;

@Component<GalleryItem>({
  metaInfo() {
    const image = `https://og-image-green-seven.vercel.app/${encodeURIComponent(this.nft.name as string)}.png?price=${this.nft.price ? Vue.filter('formatBalance')(this.nft.price, 12, 'KSM') : ''}&image=${(this.nft.image as string)}`;
    return {
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: 'KodaDot - Kusama NFT Market Explorer'
        },
        { property: 'og:type', content: 'website'},
        { property: 'og:title', content: (this.nft.name as string) },
        { property: 'og:description', content: (this.nft.description as string) },
        { property: 'og:image', content: (image)},
        { property: 'og:video', content: (this.nft.image as string) },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:site', content: '@KodaDot' },
        { property: 'twitter:title', content: (this.nft.name as string) },
        { property: 'twitter:description', content: (this.nft.description as string) },
        { property: 'twitter:image', content: (image)},
      ]
    }
  },
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    AvailableActions,
    Facts,
    // MarkdownItVueLight: MarkdownItVueLight as VueConstructor<Vue>,
    Money,
    Name,
    Sharing,
    Appreciation: () => import('./Appreciation.vue'),
    MediaResolver: () => import('../Media/MediaResolver.vue'),
    PackSaver: () => import('../Pack/PackSaver.vue')
  }
})
export default class GalleryItem extends Vue {
  private id: string = '';
  // private accountId: string = '';
  private passsword: string = '';
  private nft: NFTType = emptyObject<NFTType>();
  private imageVisible: boolean = true;
  private viewMode: string = 'default';
  private isFullScreenView: boolean = false;
  public isLoading: boolean = true;
  public mimeType: string = '';

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  public async mounted() {
    this.checkId();
    const rmrkService = getInstance();
    console.log('rmrkService', rmrkService)
    if (!rmrkService || !this.id) {
      return;
    }

    try {
      const nft = await rmrkService.getNFT(this.id);
      console.log(nft);

      this.nft = {
        ...nft,
        image: sanitizeIpfsUrl(nft.image || ''),
        animation_url: sanitizeIpfsUrl(nft.animation_url || '', 'pinata')
      };
      if (this.nft.animation_url) {
        const { headers } = await api.head(this.nft.animation_url);
        this.mimeType = headers['content-type'];
        const mediaType = resolveMedia(this.mimeType);
        this.imageVisible = ![MediaType.VIDEO, MediaType.IMAGE, MediaType.MODEL, MediaType.IFRAME].some(
          t => t === mediaType
        );
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn);
      console.warn(e);
    }

    this.isLoading = false;
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    }
  }

  public toggleView(): void {
    this.viewMode = this.viewMode === 'default' ? 'theatre' : 'default';
  }

  public toggleFullScreen(): void {
    this.isFullScreenView = !this.isFullScreenView;
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message);
  }

  get hasPrice() {
    return Number(this.nft.price) > 0;
  }

  get nftId() {
    const { id } = this.nft;
    return id;
  }

  get detailVisible() {
    return !isShareMode
  }

  protected handleAction(deleted: boolean) {
    if (deleted) {
      showNotification(`INSTANCE REMOVED`, notificationTypes.warn)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/colors";
@import "@/typography";

.nft-title {
  margin-bottom: 24px;
}

.gallery-item__skeleton {
  width: 95%;
  margin: auto;
}

.withPicture {
  margin: 0.75em 0;
}

.image-wrapper {
  position: relative;
  margin: 30px auto;
  width: 100%;

  .image {
    border: 2px solid $primary;    
  }

  .fullscreen-image {
    display: none;
  }

  .image-preview {
    &.fullscreen {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 999998;
      background: #000;

      img.fullscreen-image {
        display: block;
        width: auto !important;
        height: 100% !important;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
      }

      .image {
        visibility: hidden;
      }
    }
  }

  .column {
    transition: .3s all;
  }

  button {
    border: 2px solid $primary;
    color: $primary;
    font-weight: bold;
    text-transform: uppercase;
    padding: 7px 16px;
    font-size: 20px;
    background: #fafafa;
    z-index: 2;

    &:hover {
      color: #fff;
      background: $primary;
      cursor: pointer;
    }
  }
}

button#theatre-view {
  position: absolute;
  top: 13px;
  left: 13px;
}

button#fullscreen-view {
  position: absolute;
  bottom: 13px;
  right: 13px;

  &.fullscreen {
    position: fixed;
    z-index: 999998;
    bottom:0;
    right: 0;
  }
}

.price-block {
  border: 2px solid $primary;
  padding: 14px;

  &__original {
    color: $dark;
    font-size: 24px;
    text-transform: uppercase;
    font-weight: 500;
  }

  &__exchange {
    opacity: .6;
    color: $dark;
    margin: 0;
  }
}
</style>
