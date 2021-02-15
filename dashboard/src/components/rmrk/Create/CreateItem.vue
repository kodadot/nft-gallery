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
        <b-input v-model="view.name" expanded></b-input>
        <Tooltip :label="tooltip.name" />
      </b-field>
      <b-field label="Instance">
        <b-input v-model="view.instance" expanded></b-input>
        <Tooltip :label="tooltip.instance" />
      </b-field>
      <b-field>
        <!-- <b-switch :true-value="1" :false-value="0" 
            v-model="view.transferable" disabled>
          Transferable is by default
        </b-switch> -->
      </b-field>
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
      <MetadataUpload v-if="isImage" v-model="image" label="Click to add image" />
      <!-- <div>If your artwork is animated (audio/video/3d model) add animated</div> -->
      <MetadataUpload v-if="!isImage" v-model="animated" label="Add animated file" />
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
  private tooltip: object = {
    name: 'Name of your token',
    instance: 'Instance is like the identifier of an NFT, like a marketplace ticker. It\'s a "short computer-friendly name"',
    image: 'Upload will upload your image of the NFT',
  }
  private uploadMode: boolean = true;
  private image: Blob | null = null;
  private animated: Blob | null = null;

  get nftId(): string {
    const {collection, instance, sn} = this.view
    return `${collection}-${(instance || '').toUpperCase()}-${this.serialNumber}`
  }

  get serialNumber(): string {
    return String(this.index + 1 + this.alreadyMinted).padStart(16, '0');
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
