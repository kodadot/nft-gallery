<template>
  <div>
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
          <p class="subtitle is-size-6">
            <b>IPFS</b>: <b-button size="is-small" @click="getGwLinks">{{ multimediaCid }}</b-button>
            <ol v-if="showGwLinks">
              <li v-for="gw in gwList"
              :key="gw">
                <a :href="gw+multimediaCid" target="_blank">Gateway</a>
              </li>
            </ol>
          </p>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { extractCid } from '@/pinata';
@Component({})
export default class Facts extends Vue {
  @Prop() public nft!: any;
  public multimediaCid: string = 'IPFS Gateways';
  public showGwLinks: boolean = false;
  public gwList: any = [
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://ipfs.fleek.co/ipfs/',
    'https://dweb.link/ipfs/',
  ]

  @Watch('nft')
  public async getGwLinks() {
    this.multimediaCid = await extractCid(this.nft && this.nft.image)
    this.showGwLinks = true
  }
}
</script>
