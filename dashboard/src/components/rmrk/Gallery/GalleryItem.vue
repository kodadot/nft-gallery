 <template>
  <div class="wrapper">
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <div :class="{ box: detailVisible }">
          <b-image
            v-if="!isLoading && imageVisible"
            :src="nft.image || require('@/assets/kodadot_logo_v1_transparent_400px.png')"
            :src-fallback="require('@/assets/kodadot_logo_v1_transparent_400px.png')"
            alt="NFT minted multimedia"
            ratio="1by1"
          ></b-image>
          <b-skeleton height="524px" size="is-large" :active="isLoading"></b-skeleton>
          <MediaResolver v-if="nft.animation_url" :class="{ withPicture: imageVisible }" :src="nft.animation_url" :mimeType="mimeType" />
          <template v-if="detailVisible">
            <Appreciation :accountId="accountId" :currentOwnerId="nft.currentOwner" :nftId="nft.id" />
            <PackSaver v-if="accountId" :accountId="accountId" :currentOwnerId="nft.currentOwner" :nftId="nft.id" />
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
        <Name :nft="nft" :isLoading="isLoading" />
          <div class="card">
            <div class="card-content">
              <p class="title" :class="[ detailVisible ? 'is-size-2' : 'is-size-4' ]">
                {{ $t('legend')}}
              </p>
              <div class="subtitle is-size-7">
                <b-tag v-if="hasPrice" type="is-dark" size="is-medium">
                  <Money :value="nft.price" showFiatValue="usd" inline />
                </b-tag>
                <p v-if="!isLoading"
                  class="subtitle is-size-5">
                  <!-- <markdown-it-vue-light class="md-body" :content="nft.description"/> -->
                </p>
                <b-skeleton :count="3" size="is-large" :active="isLoading"></b-skeleton>
              </div>
            </div>
          </div>
          <template v-if="detailVisible">
            <Facts :nft="nft" />
            <Sharing />
          </template>
        </div>
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
          content: '🖼 👀 KodaDot Polkadot/Kusama NFT Market Explorer'
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

<style scoped>
.gallery-item__skeleton {
  width: 95%;
  margin: auto;
}

.withPicture {
  margin: 0.75em 0;
}
</style>
