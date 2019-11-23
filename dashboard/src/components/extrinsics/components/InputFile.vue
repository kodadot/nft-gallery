<template>
<b-field class="file">
        <b-upload
        v-model="toImport"
        >
            <a class="button is-primary extrinsic--file-upload">
                <b-icon icon="upload"></b-icon>
                <span>Click to upload</span>
            </a>
        </b-upload>
        <span class="file-name extrinsic--file-upload" v-if="toImport">
            {{ toImport.name }}
        </span>
    </b-field>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator';

@Component
export default class InputFile extends Vue {
  public toImport: any = null;
  public uiReader: any = null;
  // @PropSync('accountToImport', { type: String }) private account!: any;
  public account: any = null;

  // public readAccount(address: string): string {
  //   if (address) {
  //     this.uiReader = JSON.parse(address);
  //     return `${this.uiReader.address.slice(0, 6)}...${this.uiReader.address.slice(-6)}
  //       ${this.uiReader.meta.name}`;
  //   }
  //   return '';
  // }

  @Watch('toImport')
  public createInput(file: any): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.account = reader.result;
    };
    reader.readAsText(file);
  }

}
</script>

<style>
 .extrinsic--file-upload {
   height: inherit;
 }

 .extrinsic--dropzone .upload-draggable > section {
   padding: 0;
 }
</style>
