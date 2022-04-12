<template>
  <div class="share">
    <b-field position="is-right">
      <slot />

      <ShowQRModal :address="realworldFullPath" :title="label" />

      <b-button
        @click="toast('URL copied to clipboard')"
        v-clipboard:copy="realworldFullPathShare"
        type="is-primary is-bordered-light share-button">
        <b-icon size="is-small" pack="fas" icon="link" />
      </b-button>

      <b-tooltip
        position="is-left"
        class="share__tooltip"
        :triggers="['click']"
        :auto-close="['outside', 'escape']"
        multilined>
        <template v-slot:content>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="twitter"
            :hashtags="hashtags"
            :url="realworldFullPath"
            :title="label"
            twitter-user="KodaDot">
            <b-icon size="is-large" pack="fab" icon="twitter" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="telegram"
            :url="realworldFullPath"
            :title="label">
            <b-icon size="is-large" pack="fab" icon="telegram" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="facebook"
            :hashtags="hashtags"
            :url="realworldFullPath"
            :title="label">
            <b-icon size="is-large" pack="fab" icon="facebook" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="messenger"
            :url="realworldFullPath"
            :title="label">
            <b-icon size="is-large" pack="fab" icon="facebook-messenger" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="whatsapp"
            :url="realworldFullPath"
            :title="label">
            <b-icon size="is-large" pack="fab" icon="whatsapp" />
          </ShareNetwork>
          <ShareNetwork
            tag="button"
            class="button share__button is-medium"
            network="email"
            :url="realworldFullPath"
            :title="label">
            <b-icon size="is-large" pack="fas" icon="envelope" />
          </ShareNetwork>
        </template>
        <b-button type="is-primary is-bordered-light share-button">
          <b-icon size="is-small" pack="fas" icon="share" />
        </b-button>
      </b-tooltip>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { IFrame, emptyIframe } from '../../types'

const components = {
  ShowQRModal: () => import('@/components/shared/modals/ShowQRModal.vue'),
}
@Component({
  components,
})
export default class Sharing extends Vue {
  @Prop({ default: 'Check out this cool NFT on KodaDot' }) label!: string
  @Prop({ default: () => emptyIframe }) iframe!: IFrame
  @Prop(Boolean) onlyCopyLink!: boolean

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

  public openFallbackShareTooltip(): void {
    // only call this when share api is not available, example on web
    if (!navigator.share) {
      this.active = !this.active
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables';

.share {
  &__button {
    color: $primary;
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
      border: 2px solid $primary-light !important;
      box-shadow: $dropdown-content-shadow !important;
      background: $black !important;
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
</style>
