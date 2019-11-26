<template>
  <b-field class="file">
        <b-upload v-model="file">
            <a class="button is-primary">
                <b-icon icon="file"></b-icon>
                <span>Click to upload</span>
            </a>
        </b-upload>
        <span class="file-name bytes" v-if="file">
            {{ file.name }}
        </span>
    </b-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FileUpload extends Vue {
  private bytes: any = null;

  set file(file: any) {
    this.bytes = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.$emit('uploaded', reader.result);
    };
    reader.readAsText(file);
  }


  get file(): any {
    return this.bytes;
  }

}
</script>

<style scoped>
  .file-name.bytes {
    max-width: 100% !important;
    flex: 1;
  }

</style>