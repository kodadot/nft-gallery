<template>
  <div class="share">
    <b-field position="is-right">
      <slot />

      <p class="control">
        <b-button
          v-if="enableDownload"
          :type="btnType"
          :class="btnClass"
          @click="downloadImage()">
          <NeoIcon pack="fas" icon="download" />
        </b-button>
      </p>

      <p class="control">
        <b-button
          v-clipboard:copy="realworldFullPathShare"
          :class="btnClass"
          :type="btnType"
          @click="toast($t('toast.urlCopy'))">
          <NeoIcon pack="fas" icon="link" />
        </b-button>
      </p>

      <p class="control">
        <ShowQRModal
          :class="btnType === 'is-primary' ? 'share-option' : 'qr-basic'"
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
            <NeoIcon size="large" pack="fab" icon="twitter" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="telegram"
            :url="realworldFullPath"
            :title="$t(label)">
            <NeoIcon size="large" pack="fab" icon="telegram" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="facebook"
            :hashtags="hashtags"
            :url="realworldFullPath"
            :title="$t(label)">
            <NeoIcon size="large" pack="fab" icon="facebook" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="messenger"
            :url="realworldFullPath"
            :title="$t(label)">
            <NeoIcon size="is-large" pack="fab" icon="facebook-messenger" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="whatsapp"
            :url="realworldFullPath"
            :title="$t(label)">
            <NeoIcon size="large" pack="fab" icon="whatsapp" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="email"
            :url="realworldFullPath"
            :title="$t(label)">
            <NeoIcon size="large" pack="fas" icon="envelope" />
          </ShareNetwork>
        </template>
        <p class="control">
          <b-button :type="btnType" :class="btnClass">
            <NeoIcon pack="fas" icon="share" />
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
import { useHistoryStore } from '@/stores/history'

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
  @Prop({ default: '' }) btnType?: string

  private active = false
  private historyStore = useHistoryStore()

  public hashtags = 'KusamaNetwork,KodaDot'

  get helloText(): string {
    return this.label
  }

  get btnClass(): string {
    return this.btnType === 'is-primary' ? 'share-option' : 'is-bordered-light'
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
    this.$buefy.toast.open({
      message,
      type: 'is-neo',
    })
  }

  get currentGalleryItemImage() {
    return this.historyStore.getCurrentlyViewedItem || {}
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

  public downloadImage() {
    const { image } = this.currentGalleryItemImage
    image && downloadImage(image)
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
    background: transparent;
    border: none;
    margin: 5px;

    @include ktheme() {
      color: 1px solid theme('text-color-inverse');
    }

    & > span {
      display: flex;
      align-items: center;
    }
  }

  &__tooltip {
    .tooltip-content {
      @include ktheme() {
        box-shadow: theme('primary-shadow' !important);
        border: 1px solid theme('border-color') !important;
        background: theme('background-color') !important;
      }
    }

    .tooltip-trigger {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.is-light {
      .tooltip-content {
        @include ktheme() {
          background-color: 1px solid theme('background-color');
        }
      }
    }
  }
}

.qr-basic button {
  border: none !important;
  background-color: transparent !important;

  @include ktheme() {
    border-top: 1px solid theme('k-primary') !important;
  }
}

.share-option,
.share-option button {
  border: none !important;
  background-color: transparent !important;

  .icon svg {
    @include ktheme() {
      color: 1px solid theme('k-blue') !important;
    }
  }
}
</style>
