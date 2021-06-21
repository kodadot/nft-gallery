 <template>
  <div class="wrapper section no-padding-desktop gallery-item mb-6">
    <div class="container">
      <div class="columns">
          <div class="image-wrapper">
              <button id="theatre-view" @click="toggleView" v-if="!isLoading && imageVisible">{{ viewMode === 'default' ? $t('theatre') : $t('default') }} {{$t('view')}}</button>
              <div class="column" :class="{ 'is-12': viewMode === 'theatre', 'is-6 is-offset-3': viewMode === 'default'}">
                <div class="image-preview" :class="{fullscreen: isFullScreenView}">
                  <b-image
                    v-if="!isLoading && imageVisible"
                    :src="meta.image || require('@/assets/kodadot_logo_v1_transparent_400px.png')"
                    :src-fallback="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
                    alt="KodaDot NFT minted multimedia"
                    ratio="1by1"
                  ></b-image>
                  <img class="fullscreen-image" :src="meta.image || require('@/assets/kodadot_logo_v1_transparent_400px.png')" alt="KodaDot NFT minted multimedia">
                  <b-skeleton height="524px" size="is-large" :active="isLoading"></b-skeleton>
                  <MediaResolver v-if="meta.animation_url" :class="{ withPicture: imageVisible }" :src="meta.animation_url" :mimeType="mimeType" />
                </div>
              </div>
              <button id="fullscreen-view" @keyup.esc="minimize" @click="toggleFullScreen" v-if="!isLoading && imageVisible" :class="{fullscreen: isFullScreenView}">
                <b-icon
                  :icon="isFullScreenView ? 'compress-alt' : 'arrows-alt'"
                  >
                </b-icon>
              </button>
          </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <Appreciation :emotes="nft.emotes"
            :accountId="accountId"
            :currentOwnerId="nft.currentOwner"
            :nftId="nft.id"
            :burned="nft.burned" />

          <div class="nft-title">
            <Name :nft="nft" :isLoading="isLoading" />
          </div>

          <p class="label">
            {{ $t('legend')}}
          </p>

          <div class="subtitle is-size-7">
            <p v-if="!isLoading"
              class="subtitle is-size-5">
              {{ meta.description }}
              <!-- <markdown-it-vue-light class="md-body" :content="nft.description"/> -->
            </p>
            <b-skeleton :count="3" size="is-large" :active="isLoading"></b-skeleton>
          </div>
        </div>
        <div class="column is-3 is-offset-3" v-if="detailVisible">

          <b-skeleton :count="2" size="is-large" :active="isLoading"></b-skeleton>
          <div class="price-block" v-if="hasPrice">
            <div class="price-block__original">{{ nft.price | formatBalance(12, 'KSM') }}</div>
            <!--<div class="label price-block__exchange">{{ this.nft.price | formatBalance(12, 'USD') }}</div>--> <!-- // price in USD -->
            <div class="label">{{ $t('price') }}</div>
          </div>

          <template v-if="detailVisible && !nft.burned">
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
          <br>
          <template v-if="detailVisible">
            <Facts :nft="nft" :meta="meta"  />
          </template>
        </div>
      </div>
      <hr />
      <BaseCommentSection :nft="nft" :meta="meta" />
    </div>

  </div>
</template>

<script lang="ts" >
import { Component, Vue } from 'vue-property-decorator';
import { getInstance } from '@/components/rmrk/service/RmrkService';
// import MarkdownItVueLight from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
import { NFT, NFTMetadata, Emotion, Emote } from '../service/scheme';
import { sanitizeIpfsUrl, resolveMedia } from '../utils';
import { emptyObject } from '@/utils/empty';

// import AvailableActions from './AvailableActions.vue';
import { notificationTypes, showNotification } from '@/utils/notification';
// import Money from '@/components/shared/format/Money.vue';
// import/ Sharing from '@/components/rmrk/Gallery/Item/Sharing.vue';
// import Facts from '@/components/rmrk/Gallery/Item/Facts.vue';
// import Name from '@/components/rmrk/Gallery/Item/Name.vue';

import isShareMode from '@/utils/isShareMode';
import nftById from '@/queries/nftById.graphql'
import { fetchNFTMetadata } from '../utils';
import { get, set } from 'idb-keyval';
import { MediaType } from '../types';
import axios from 'axios';

@Component<GalleryItem>({
  metaInfo() {
    const image = `https://og-image-green-seven.vercel.app/${encodeURIComponent(this.nft.name as string)}.png?price=${this.nft.price ? Vue.filter('formatBalance')(this.nft.price, 12, 'KSM') : ''}&image=${(this.meta.image as string)}`;
    return {
      title: this.nft.name,
      titleTemplate: '%s | Low Carbon NFTs',
      meta: [
        { name: 'description', content: (this.meta.description as string) },
        { property: 'og:title', content: (this.nft.name as string) },
        { property: 'og:description', content: (this.meta.description as string) },
        { property: 'og:image', content: (image)},
        { property: 'og:video', content: (this.meta.image as string) },
        { property: 'og:author', content: (this.nft.currentOwner as string) },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:site', content: '@KodaDot' },
        { property: 'twitter:title', content: (this.nft.name as string) },
        { property: 'twitter:description', content: (this.meta.description as string) },
        { property: 'twitter:image', content: (image)},
      ]
    }
  },
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    AvailableActions: () => import('./AvailableActions.vue'),
    Facts: () => import('@/components/rmrk/Gallery/Item/Facts.vue'),
    // MarkdownItVueLight: MarkdownItVueLight as VueConstructor<Vue>,
    Money: () => import('@/components/shared/format/Money.vue'),
    Name: () => import('@/components/rmrk/Gallery/Item/Name.vue'),
    Sharing: () => import('@/components/rmrk/Gallery/Item/Sharing.vue'),
    Appreciation: () => import('./Appreciation.vue'),
    MediaResolver: () => import('../Media/MediaResolver.vue'),
    PackSaver: () => import('../Pack/PackSaver.vue'),
    BaseCommentSection: () => import('@/components/subsocial/BaseCommentSection.vue')
  }
})
export default class GalleryItem extends Vue {
  private id: string = '';
  // private accountId: string = '';
  private passsword: string = '';
  private nft: NFT = emptyObject<NFT>();
  private imageVisible: boolean = true;
  private viewMode: string = 'default';
  private isFullScreenView: boolean = false;
  public isLoading: boolean = true;
  public mimeType: string = '';
  public meta: NFTMetadata = emptyObject<NFTMetadata>();
  public emotes: Emote[] = []

  get accountId() {
    return this.$store.getters.getAuthAddress;
  }

  public async created() {
    this.checkId();
    const rmrkService = getInstance();
    console.log('rmrkService', rmrkService)
    if (!rmrkService || !this.id) {
      return;
    }

    try {
      // const nft = await rmrkService.getNFT(this.id);
     this.$apollo.addSmartQuery('nft',{
        query: nftById,
        variables: {
          id: this.id
        },
        update: ({ nFTEntity }) => ({  ...nFTEntity, emotes: nFTEntity.emotes?.nodes }),
        result: () => this.fetchMetadata(),
        pollInterval: 5000
      })

      // console.log(nft);

      // this.nft = {
      //   ...nft,
      //   image: sanitizeIpfsUrl(nft.image || ''),
      //   animation_url: sanitizeIpfsUrl(nft.animation_url || '', 'pinata')
      // };
      // }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn);
      console.warn(e);
    }

    this.isLoading = false;
  }

  public async fetchMetadata() {
    console.log(this.nft.emotes);

    if (this.nft['metadata'] && !this.meta['image']) {
      const m = await get(this.nft.metadata)
      const meta = m ? m : await fetchNFTMetadata(this.nft)
      this.meta = {
        ...meta,
        image: sanitizeIpfsUrl(meta.image || ''),
        animation_url: sanitizeIpfsUrl(meta.animation_url || '', 'pinata')
      }

      if (this.meta.animation_url && !this.mimeType) {
        const { headers } = await axios.head(this.meta.animation_url);
        this.mimeType = headers['content-type'];
        const mediaType = resolveMedia(this.mimeType);
        this.imageVisible = ![MediaType.VIDEO, MediaType.IMAGE, MediaType.MODEL, MediaType.IFRAME].some(
          t => t === mediaType
        );
      }

      if (!m) {
        set(this.nft.metadata, meta)
      }
    }
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

  public minimize(): void {
    this.isFullScreenView = false;
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

<style lang="scss">
@import "@/styles/variables";

.gallery-item {
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
      color: #fff;
      font-weight: bold;
      text-transform: uppercase;
      padding: 7px 16px;
      font-size: 20px;
      background: $scheme-main;
      z-index: 2;

      &:hover {
        background: $primary;
        cursor: pointer;
      }
    }
  }

  button#theatre-view {
    position: absolute;
    top: 13px;
    left: 13px;
    @media screen and (max-width: 768px) {
        display: none;
    }

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
      color: $scheme-invert;
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

  .card {
    border-radius: 0 !important;
    box-shadow: none;
    border: 2px solid $primary;

    &-header {
      border-radius: 0;
      position: relative;

      &:before {
        content: '';
        width: 100%;
        height: 2px;
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        background: $primary;
      }

      &-title {
        color: $scheme-invert;
      }
    }

    &-footer {
      border-radius: none;
      border-top: none;

      &-item:not(:last-child){
        border-right-color: $primary;
      }
    }
  }

  &.no-padding-desktop {
    @media screen and (min-width: 1023px) {
      padding: 0;
    }
  }

}
</style>
