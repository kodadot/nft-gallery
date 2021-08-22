<template>
  <div class="card">
    <div class="card-image">
      <figure class="image">
        <img
          :src="url"
          alt="Placeholder image"
        />
      </figure>
    </div>
    <div class="card-content">
      <p class="title is-6">{{ file.name }}</p>
      <div class="content">
        <b-field :label="$i18n.t('Collection description')" >
        <b-input
              placeholder="Name your NFT"
              v-model="name"
              expanded
              class="mr-0"
              spellcheck="true"
            ></b-input>
            </b-field>
        <b-field :label="$i18n.t('Collection description')" >
            <b-input
              v-model="description"
              maxlength="500"
              type="textarea"
              placeholder="Describe your NFT"
              spellcheck="true"
            ></b-input>
          </b-field>
          <BalanceInput @input="updateMeta" label="Price" />
      </div>
    </div>
    <div class="card-footer">
      <a href="#" class="card-footer-item">Remove</a>

    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { MassMintNFT } from '../service/scheme';
import shouldUpdate from '@/utils/shouldUpdate';

@Component({
  components: {
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  }
})
export default class MassMintItem extends Vue {
  @Prop() public nft!: MassMintNFT;
  protected name: string = '';
  protected description: string = '';
  protected image!: File;
  protected price: string | number = '0';
  @Prop() public file!: File;

  protected updateMeta(value: number) {
    this.price = value;
  }

  get url() {
    return URL.createObjectURL(this.file);
  }

  @Watch('nft')
  protected onMassMintNftChanged(value: MassMintNFT, oldValue: MassMintNFT) {

      this.name = value.name;
      this.description = value.description;
      this.price = value.price;

  }
}
</script>
