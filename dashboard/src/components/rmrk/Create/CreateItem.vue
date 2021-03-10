<template>
  <div class="card create-token-card">

    <div class="card-content">
      <b-field>
        <b-button type="is-danger" icon-left="times" outlined @click="removeToken" />
      </b-field>
      <b-field label="Id">
        <b-input v-model="nftId" disabled></b-input>
      </b-field>
      <b-field :label="$i18n.t('Serial Number')">
        <b-input v-model="serialNumber" disabled></b-input>
      </b-field>
      <b-field :label="$i18n.t('Collection')">
        <b-input v-model="view.collection" disabled></b-input>
      </b-field>
      <b-field :label="$i18n.t('Name')">
        <b-input v-model="view.name" expanded></b-input>
        <Tooltip :label="$i18n.t('Name of your token')" />
      </b-field>
      <!-- <b-field>
        <b-switch :true-value="1" :false-value="0"
            v-model="view.transferable" disabled>
          {{ $t('Transferable is by default') }}
        </b-switch>
      </b-field> -->
      <!-- <b-field v-if="view.transferable" label="Price">
        <b-input v-model="view.price" ></b-input>
      </b-field> -->
      <b-field>
        <b-switch v-model="uploadMode"
          passive-type="is-dark"
          :rounded="false">
          {{ uploadMode ? 'Upload through KodaDot' : 'IPFS hash' }}
        </b-switch>
      </b-field>
    <template v-if="uploadMode">
      <b-field label="Description">
        <b-input
        v-model="view.meta.description"
          maxlength="200"
          type="textarea"
        ></b-input>
      </b-field>
      <b-field>
        <b-switch v-model="isImage"
          passive-type="is-dark"
          :rounded="false">
          {{ isImage ? 'Static Image' : 'Animated multimedia' }}
        </b-switch>
      </b-field>
      <MetadataUpload v-if="isImage" v-model="image" :label="$i18n.t('Click to add image')" />
      <!-- <div>If your artwork is animated (audio/video/3d model) add animated</div> -->
      <MetadataUpload v-if="!isImage" v-model="animated" :label="$i18n.t('Add Animated File')" />
      <b-field :label="$i18n.t('Image data')">
        <b-input v-model="view.meta.image_data"></b-input>
      </b-field>
    </template>

    <b-field v-else :label="$i18n.t('Metadata IPFS Hash')">
      <b-input v-model="view.metadata"></b-input>
    </b-field>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { NFT, NFTMetadata } from '../service/scheme';
import { emptyObject } from '@/utils/empty';
import { client } from '@/textile';
import MetadataUpload from './MetadataUpload.vue'
import Tooltip from '@/components/shared/Tooltip.vue';
import slugify from 'slugify'

interface NFTAndMeta extends NFT {
  meta: NFTMetadata
}

@Component({
  components: {
    MetadataUpload,
    Tooltip
  }
})
export default class CreateItem extends Vue {
  @Prop() public index!: number;
  @Prop() public alreadyMinted!: number;
  @Prop() public view!: NFTAndMeta;
  private isImage: boolean = true;
  private uploadMode: boolean = true;
  private image: Blob | null = null;
  private animated: Blob | null = null;

  get nftId(): string {
    const {collection, name } = this.view
    return `${collection}-${slugify(name || '', '_').toUpperCase()}-${this.serialNumber}`
  }

  get serialNumber(): string {
    return String(this.index + 1 + this.alreadyMinted).padStart(16, '0');
  }

  @Emit('remove')
  public removeToken() {
    return this.index
  }

  private async m() {
    const c = await client();
  }

  @Emit('update')
  private updateItem() {
    return { index: this.index, view: {
      ...this.view,
      id: this.nftId
    } }
  }

  @Watch('animated')
  private animatedUpload(val: Blob, oldVal: Blob | null) {
    if (val && !oldVal) {
      this.$emit('animated', { image: val, index: this.index })
    }
  }

  @Watch('image')
  private imageUpload(val: Blob, oldVal: Blob | null) {
    if (val && !oldVal) {
      this.$emit('upload', { image: val, index: this.index })
    }
  }

}
</script>

<style scoped>
.create-token-card {
  margin-bottom: 1em;
}
</style>
