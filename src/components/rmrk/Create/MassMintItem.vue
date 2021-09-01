<template>
  <div class="columns">
    <div class="column is-one-quarter">
      <figure class="image">
        <img :src="url" alt="Placeholder image" />
      </figure>
      <p class="mt-1 title is-6">{{ nft.file.name }}</p>
      <a @click="remove" class="card-footer-item">Remove</a>
    </div>
    <div class="column">
      <b-field :label="$i18n.t('Collection description')">
        <b-input
          placeholder="Name your NFT"
          v-model="vName"
          expanded
          class="mr-0"
          spellcheck="true"
        ></b-input>
      </b-field>
      <b-field :label="$i18n.t('Collection description')">
        <b-input
          v-model="vDescription"
          maxlength="500"
          type="textarea"
          placeholder="Describe your NFT"
          spellcheck="true"
        ></b-input>
      </b-field>
      <BalanceInput v-model="vPrice" label="Price" :calculate="false" />
    </div>
  </div>
</template>

<script lang="ts" >
import {
  Component,
  Prop,
  Vue,
  PropSync,
  Emit
} from 'vue-property-decorator';
import { MassMintNFT } from '../service/scheme';

@Component({
  components: {
    BalanceInput: () => import('@/components/shared/BalanceInput.vue')
  }
})
export default class MassMintItem extends Vue {
  @Prop() public nft!: MassMintNFT;
  @PropSync('name', { type: String }) vName!: string;
  @PropSync('description', { type: String }) vDescription!: string;
  @PropSync('price', { type: Number }) vPrice!: number;
  @Prop(Number) public index!: number;
  @Prop() public file!: File;

  get url() {
    return URL.createObjectURL(this.nft.file);
  }

  @Emit('remove')
  protected remove() {
    return this.index;
  }

}
</script>

