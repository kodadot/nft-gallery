<template>
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
      <p class="card-footer-item">
        <span>
          <a
            v-clipboard:copy="iframeUri"
            @click="toast('Code copied to clipboard')">
            <b-icon
              size="is-medium"
              pack="fas"
              icon="code">
            </b-icon>
          </a>
        </span>
      </p>
    </footer>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IFrame, emptyIframe } from '../../types';

@Component({})
export default class Sharing extends Vue {
  @Prop({ default: 'Check this cool NFT on %23KusamaNetwork %23kodadot' }) label!: string;
  @Prop({ default: () => emptyIframe }) iframe!: IFrame;

  get helloText() {
    return this.label;
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
    this.$buefy.toast.open(message);
  }
}
</script>
