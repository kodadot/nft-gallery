<template>
  <div class="card create-token-card">
    <div class="card-content">
      <b-field label="Id">
        <b-input v-model="nftId" disabled></b-input>
      </b-field>
      <b-field label="Serial Number">
        <b-input v-model="serialNumber" disabled></b-input>
      </b-field>
      <b-field label="Collection">
        <b-input v-model="view.collection" disabled></b-input>
      </b-field>
      <b-field label="Name">
        <b-input v-model="view.name"></b-input>
      </b-field>
      <b-field label="Instance">
        <b-input v-model="view.instance"></b-input>
      </b-field>
      <b-switch v-model="view.transferable">
        Transferable
      </b-switch>
      <b-field v-if="view.transferable" label="Price">
        <b-input v-model="view.price" ></b-input>
      </b-field>
    <b-switch v-model="uploadMode" passive-type="is-dark" type="is-info">
      {{ uploadMode ? 'Upload' : 'IPFS hash' }}
    </b-switch>
    <template v-if="uploadMode">
      <b-field label="Description">
        <b-input
          v-model="view.meta.description"
          maxlength="200"
          type="textarea"
        ></b-input>
      </b-field>
      <MetadataUpload v-model="image" label="Click to add image" />
      <div>If your artwork is animated (audio/video/3d model) add animated</div>
      <MetadataUpload v-model="animatimated" label="Add animated file" />
      <b-field label="Image data">
        <b-input v-model="view.meta.image_data"></b-input>
      </b-field>
    </template>

    <b-field v-else label="Metadata IPFS Hash">
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

interface NFTAndMeta extends NFT {
  meta: NFTMetadata
}

@Component({
  components: {
    MetadataUpload
  }
})
export default class CreateItem extends Vue {
  @Prop() public index!: number;
  @Prop() public view!: NFTAndMeta;
  private uploadMode: boolean = true;
  private image: Blob | null = null;
  private animatimated: Blob | null = null;

  get nftId(): string {
    const {collection, instance, sn} = this.view
    return `${collection}-${instance}-${this.serialNumber}`
  }

  get serialNumber(): string {
    return String(this.index + 1).padStart(16, '0');
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

  @Watch('animatimated')
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

// {
//   "collection": "241B8516516F381A-OKSM",
//   "name": "Kusama Cube",
//   "transferable": 1,
//   "sn": "0000000000000001",
//   "metadata": "ipfs://ipfs/QmQGFnoHCRtAcPaWcoiTHHTJ7TEhrpur5WbZSjZdeY3bEp"
// }
