<template>
  <div class="">
    <b-field>
      <p class="control">
        <ShowQRModal />
      </p>
      <p class="control">
        <b-button
          @click="toast('URL copied to clipboard')"
          v-clipboard:copy="realworldFullPathShare"
          type="is-primary"
        >
          <b-icon
            size="is-small"
            pack="fas"
            icon="link">
          </b-icon>
        </b-button>
      </p>
      <p class="control">
        <b-tooltip
          position="is-left"
          :triggers="['click']"
          :auto-close="['outside', 'escape']"
          :active="active"
          multilined
        >
          <template v-slot:content>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="twitter"
              :url="realworldFullPath"
              :title="label"
              twitter-user="KodaDot"
            >
              <b-icon
                size="is-large"
                pack="fab"
                icon="twitter"
              >
              </b-icon>
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="telegram"
              :url="realworldFullPath"
              :title="label"
            >
              <b-icon
                size="is-large"
                pack="fab"
                icon="telegram"
              >
              </b-icon>
            </ShareNetwork>
            <!-- <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="line"
              :url="realworldFullPath"
              :title="label"
            >
              <b-icon
                size="is-large"
                pack="fab"
                icon="line"
              >
              </b-icon>
            </ShareNetwork> -->
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="facebook"
              :url="realworldFullPath"
              :title="label"
            >
              <b-icon
                size="is-large"
                pack="fab"
                icon="facebook"
              >
              </b-icon>
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="messenger"
              :url="realworldFullPath"
              :title="label"
            >
              <b-icon
                size="is-large"
                pack="fab"
                icon="facebook-messenger"
              >
              </b-icon>
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="whatsapp"
              :url="realworldFullPath"
              :title="label"
            >
              <b-icon
                size="is-large"
                pack="fab"
                icon="whatsapp"
              >
              </b-icon>
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="pinterest"
              :url="realworldFullPath"
              :title="label"
            >
              <b-icon
                size="is-large"
                pack="fab"
                icon="pinterest"
              >
              </b-icon>
            </ShareNetwork>
            <ShareNetwork
              tag="button"
              class="button share__button is-medium"
              network="email"
              :url="realworldFullPath"
              :title="label"
            >
              <b-icon
                size="is-large"
                pack="fas"
                icon="envelope"
              >
              </b-icon>
            </ShareNetwork>
            <b-button
              size="is-medium"
              v-clipboard:copy="iframeUri"
              @click="toast('Code copied to clipboard')"
              class="share__button"
            >
              <b-icon
                size="is-medium"
                pack="fas"
                icon="code">
              </b-icon>
            </b-button>
          </template>
          <b-button
            type="is-primary"
          >
            <b-icon
              size="is-small"
              pack="fas"
              icon="share-alt"
            >
            </b-icon>
          </b-button>
        </b-tooltip>
      </p>
    </b-field>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IFrame, emptyIframe } from '../../types'

const components = {
  ShowQRModal: () => import('@/components/shared/modals/ShowQRModal.vue'),
}
@Component({
  components
})
export default class Sharing extends Vue {
  @Prop({ default: 'Check this cool NFT on #KusamaNetwork #KodaDot' }) label!: string;
  @Prop({ default: () => emptyIframe }) iframe!: IFrame;
  @Prop(Boolean) onlyCopyLink!: boolean;

  private active = false;

  get helloText() {
    return this.label
  }

  get realworldFullPath() {
    return `${window.location.origin}${this.$route.fullPath}`
  }

  get realworldFullPathShare() {
    return `${window.location.origin}${this.$route.fullPath}`
  }

  get telegramUri() {
    return `tg://msg_url?url=${this.realworldFullPath}&text=${this.helloText}`
  }

  get twitterUri() {
    return `https://twitter.com/intent/tweet?text=${this.helloText}&via=KodaDot&url=${this.realworldFullPath}`
  }

  // get linemeUri() {
  //   return `https://lineit.line.me/share/ui?url=${this.realworldFullPath}&text=${this.helloText}`;
  // }

  get width() {
    return this.iframe.width || '480px'
  }

  get height() {
    return this.iframe.height || '840px'
  }

  get customIframeUri() {
    return this.iframe.customUrl || this.realworldFullPath
  }

  get iframeUri() {
    return `
    <iframe
      src="${this.customIframeUri}"
      title="${this.label}"
      style="width:${this.width};height:${this.height};border:none;"
    ></iframe>
    `
  }

  public toast(message: string): void {
    this.$buefy.toast.open(message)
  }

  public async shareTooltip() {
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
        console.error(err)
      }
    }
  }

  public openFallbackShareTooltip() {
    // only call this when share api is not available, example on web
    if (!navigator.share) {
      this.active = !this.active
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/variables";

.share {
  border-radius: 0;
  box-shadow: none;
  border: 2px solid $primary;

  .card-footer {
    border: none;
    &-item:not(:last-child){
      border-right-color: $primary;
     }
    &-item {
      padding: 0rem  1rem;
      cursor: pointer;
      &:hover {
        .share__root {
          color: $primary;
        }
      }
    }
  }
  &__button {
    color: $primary;
    background: transparent;
    border: none;
    margin: 5px;

    &:hover{
      color: $grey;
    }

    &:focus {
      &:not(:active) {
        //box-shadow: 0px 0px 5px 0.5px #d32e79;
      }
    }

    & > span {
      display: flex;
      align-items: center;
    }
  }

  &__tooltip {
    width: 100%;

    .tooltip-content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-around;
      width: 100%;
      min-width: 200px;
      max-width: 300px;

      &:before {
        display: none;
      }
    }

    .tooltip-trigger {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.is-light  {
      .tooltip-content {
        background-color: $white;
      }
    }
  }

  .share__root{
    &:hover {
      color: $primary;
    }
  }

}
</style>
