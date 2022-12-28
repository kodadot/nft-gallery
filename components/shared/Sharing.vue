<template>
  <div class="share">
    <b-field position="is-right">
      <slot />

      <p class="control">
        <b-button
          v-if="enableDownload"
          :type="btnType"
          class="share-option"
          @click="downloadImage()">
          <b-icon pack="fas" icon="download" />
        </b-button>
      </p>

      <p class="control">
        <b-button
          v-clipboard:copy="realworldFullPathShare"
          class="share-option"
          :type="btnType"
          @click="toast($t('toast.urlCopy'))">
          <b-icon pack="fas" icon="link" />
        </b-button>
      </p>

      <p class="control">
        <ShowQRModal
          class="share-option"
          :address="realworldFullPath"
          :title="$t(label)"
          :type="btnType" />
      </p>

      <b-tooltip
        position="is-left"
        class="share__tooltip"
        :triggers="['click']"
        :auto-close="['outside', 'escape']"
        multilined>
        <template #content>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="twitter"
            :hashtags="hashtags"
            :url="realworldFullPath"
            :title="$t(label)"
            twitter-user="KodaDot">
            <b-icon size="is-large" pack="fab" icon="twitter" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="telegram"
            :url="realworldFullPath"
            :title="$t(label)">
            <b-icon size="is-large" pack="fab" icon="telegram" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="facebook"
            :hashtags="hashtags"
            :url="realworldFullPath"
            :title="$t(label)">
            <b-icon size="is-large" pack="fab" icon="facebook" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="messenger"
            :url="realworldFullPath"
            :title="$t(label)">
            <b-icon size="is-large" pack="fab" icon="facebook-messenger" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="whatsapp"
            :url="realworldFullPath"
            :title="$t(label)">
            <b-icon size="is-large" pack="fab" icon="whatsapp" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="email"
            :url="realworldFullPath"
            :title="$t(label)">
            <b-icon size="is-large" pack="fas" icon="envelope" />
          </ShareNetwork>
        </template>
        <p class="control">
          <b-button :type="btnType" class="share-option">
            <b-icon pack="fas" icon="share" />
          </b-button>
        </p>
      </b-tooltip>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { IFrame, emptyIframe } from '../../components/rmrk/types'
import { downloadImage } from '~/utils/download'

const components = {
  ShowQRModal: () => import('@/components/shared/modals/ShowQRModal.vue'),
}
@Component({
  components,
})
export default class Sharing extends Vue {
  @Prop({ default: 'sharing.nft' }) label!: string
  @Prop({ default: () => emptyIframe }) iframe!: IFrame
  @Prop(Boolean) enableDownload!: boolean
  @Prop({ default: false }) isPrimary?: boolean
  @Prop({ default: '' }) btnType?: string

  private active = false

  private hashtags = 'KusamaNetwork,KodaDot'

  get helloText(): string {
    return this.label
  }

  get realworldFullPath(): string {
    return `${window.location.origin}${this.$route.fullPath}`
  }

  get realworldFullPathShare(): string {
    return `${window.location.origin}${this.$route.fullPath}`
  }

  get telegramUri(): string {
    return `tg://msg_url?url=${this.realworldFullPath}&text=${this.helloText}`
  }

  get twitterUri(): string {
    return `https://twitter.com/intent/tweet?text=${this.helloText}&via=KodaDot&url=${this.realworldFullPath}`
  }

  // get linemeUri() {
  //   return `https://lineit.line.me/share/ui?url=${this.realworldFullPath}&text=${this.helloText}`;
  // }

  get width(): string {
    return this.iframe.width || '480px'
  }

  get height(): string {
    return this.iframe.height || '840px'
  }

  get customIframeUri(): string {
    return this.iframe.customUrl || this.realworldFullPath
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
  }

  get currentGalleryItemImage(): { image: string; name: string } {
    return this.$store.getters['history/getCurrentlyViewedItem'] || {}
  }

  public async shareTooltip(): Promise<void> {
    this.openFallbackShareTooltip()
    if (navigator.share) {
      const shareData = {
        title: 'KodaDot',
        text: this.label,
        url: this.realworldFullPath,
      }
      try {
        await navigator.share(shareData)
      } catch (err) {
        this.$consola.error(err)
      }
    }
  }

  protected downloadImage() {
    const { image, name } = this.currentGalleryItemImage
    image && downloadImage(image, name)
  }

  public openFallbackShareTooltip(): void {
    // only call this when share api is not available, example on web
    if (!navigator.share) {
      this.active = !this.active
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.share {
  &__button {
    color: $white;
    background: transparent;
    border: none;
    margin: 5px;

    & > span {
      display: flex;
      align-items: center;
    }
  }

  &__tooltip {
    .tooltip-content {
      border: 1px solid $black !important;
      box-shadow: $primary-shadow !important;
      background: $white !important;
    }

    .tooltip-trigger {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.is-light {
      .tooltip-content {
        background-color: $white;
      }
    }
  }
}

.share-option,
.share-option button {
  border: none;
  background-color: transparent !important;

  .icon svg {
    color: $k-blue;
  }
}

.dark-mode .share__tooltip {
  .tooltip-content {
    background-color: $dark-accent !important;
    border: 1px solid $white !important;
    box-shadow: $primary-shadow-dark !important;
  }
}
</style>
