<template>
  <div class="share">
    <footer class="card-footer">
      <div
        class="card-footer-item"
        @click="toast('URL copied to clipboard')"
      >
        <b-button
          v-clipboard:copy="realworldFullPathShare"
          size="is-small"
          class="share__root share__button"
        >
          <b-icon
            size="is-medium"
            pack="fas"
            icon="link"
          />
        </b-button>
      </div>
      <div
        v-if="!onlyCopyLink"
        class="card-footer-item"
        @click="shareTooltip"
        @focusout="openFallbackShareTooltip"
      >
        <b-tooltip
          position="is-left"
          class="share__tooltip"
          :triggers="['click']"
          :auto-close="['outside', 'escape']"
          :active="active"
          multilined
        >
          <template #content>
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
              />
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
              />
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
              />
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
              />
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
              />
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
              />
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
              />
            </ShareNetwork>
            <b-button
              v-clipboard:copy="iframeUri"
              size="is-medium"
              class="share__button"
              @click="toast('Code copied to clipboard')"
            >
              <b-icon
                size="is-medium"
                pack="fas"
                icon="code"
              />
            </b-button>
          </template>
          <b-button
            type="is-dark"
            class="share__root share__button"
            size="is-small"
          >
            <b-icon
              size="is-large"
              pack="fas"
              icon="share-alt"
            />
          </b-button>
        </b-tooltip>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { IFrame, emptyIframe } from '../../types'

@Component({})
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
