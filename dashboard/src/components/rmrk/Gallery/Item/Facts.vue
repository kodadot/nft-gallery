<template>
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
            <b>ID:</b> {{ nft.id }}
          </p>
          <p class="subtitle is-size-6">
            <b>{{ $t('collection') }}:</b>{{ nft.collection }}
          </p>
          <p class="subtitle is-size-6">
            <b>SN:</b>{{ nft.sn }}
          </p>
          <p class="subtitle is-size-6">
            <b>TAGS:</b>
             <b-taglist>
              <b-tag v-for="(tag, index) in tags" :key="index">{{tag}}</b-tag>
            </b-taglist>
          </p>
          <ArweaveLink v-if="nft.imageArId" :id="nft.imageArId" label="image" />
          <ArweaveLink v-if="nft.animationArId" :id="nft.animationArId" label="animated" />
          <p v-if="imageId" class="subtitle is-size-6"  >
            <b>IPFS</b>:
            <ol>
              <li v-for="gw in gwList"
              :key="gw">
                <a :href="gw+imageId" target="_blank">Gateway</a>
              </li>
            </ol>
          </p>
        </div>
      </div>
    </b-collapse>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { extractCid } from '@/utils/ipfs';
import { NFTWithMeta } from '../../service/scheme';
import { emptyObject } from '@/utils/empty';
const components = {
  ArweaveLink: () => import('@/components/shared/ArweaveLink.vue')
};

@Component({ components })
export default class Facts extends Vue {
  @Prop({ default: () => emptyObject<NFTWithMeta>() }) public nft!: NFTWithMeta;
  public multimediaCid: string = '';
  public showGwLinks: boolean = false;
  public gwList: any = [
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://ipfs.fleek.co/ipfs/',
    'https://dweb.link/ipfs/'
  ];

  get tags() {
    return this.nft.attributes.filter(({ trait_type }) => !trait_type).map(({ value }) => value)
  }


  get imageId() {
    return extractCid(this.nft.image);
  }

// public created() {
  //   console.log(this.nft)
  //   this.multimediaCid = extractCid(this.nft.image);
  //   this.showGwLinks = true;
  // }
}
</script>
