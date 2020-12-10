<template>
  <div class="card create-token-card">
    <div class="card-content">
      <b-field label="Serial Number">
        <b-input v-model="serialNumber" disabled></b-input>
      </b-field>
      <b-field label="Collection">
        <b-input v-model="view.collection" disabled></b-input>
      </b-field>
      <b-field label="Name">
        <b-input v-model="view.name"></b-input>
      </b-field>
      <b-switch v-model="view.transferable">
        Transferable
      </b-switch>
      <!-- <b-switch v-model="uploadMode" passive-type="is-dark" type="is-info">
        {{ uploadMode ? 'Upload' : 'IPFS hash' }}
      </b-switch> -->
      <!-- <MetadataUpload v-if="uploadMode" @change="upload" /> -->
      <b-field label="Metadata IPFS Hash">
        <b-input v-model="view.metadata"></b-input>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { RmrkView } from '../types';
import { emptyObject } from '@/utils/empty';
import { client } from '@/textile';
import MetadataUpload from './MetadataUpload.vue'

@Component({
  components: {
    MetadataUpload
  }
})
export default class CreateItem extends Vue {
  @Prop() public index!: number;
  @Prop() public view!: RmrkView;
  private uploadMode: boolean = true;

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
      sn: this.serialNumber
    } }
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
