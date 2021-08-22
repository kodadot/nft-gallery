<template>
  <div class="card">
    <div class="card-image">
      <figure class="image" >
        <img
          :src="url"
          alt="Placeholder image"
        />
      </figure>
    </div>
    <div class="card-content">
      <p class="title is-6">{{ nft.file.name }}</p>
      <div class="content">
        <b-field :label="$i18n.t('Collection description')" >
        <b-input
              placeholder="Name your NFT"
              v-model="vName"
              expanded
              class="mr-0"
              spellcheck="true"
            ></b-input>
            </b-field>
        <b-field :label="$i18n.t('Collection description')" >
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
    <div class="card-footer">
      <a href="#" class="card-footer-item">Remove</a>

    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator';
import { MassMintNFT } from '../service/scheme';
import shouldUpdate from '@/utils/shouldUpdate';

@Component({
  components: {
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  }
})
export default class MassMintItem extends Vue {
  @Prop() public nft!: MassMintNFT;
  @PropSync('name', { type: String }) vName!: string
  @PropSync('description', { type: String }) vDescription!: string
  @PropSync('price', { type: Number }) vPrice!: number;
  // protected description: string = '';
  // protected image!: File;
  // protected price: number = 0;
  @Prop() public file!: File;


  get url() {
    return URL.createObjectURL(this.nft.file);
  }

  // @Watch('nft')
  // protected onMassMintNftChanged(value: MassMintNFT, oldValue: MassMintNFT) {
  //   console.log('onMassMintNftChanged', value, oldValue);
  //   if (shouldUpdate(value, oldValue)) {
  //     this.name = value.name;
  //     this.description = value.description;
  //     this.price = value.price;
  //   }
  // }


}
</script>
