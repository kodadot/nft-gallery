<template>
  <div class="field">
    <div class="file is-info has-name is-fullwidth is-right">
      <label class="file-label">
        <input class="file-input" type="file" name="account" @change="onFileChange" />
        <a class="button is-primary">
          <span>
            <font-awesome-icon icon="folder-open"/>
            Choose an Account</span>
        </a>
        <span class="file-name">{{account.slice(12, 25)}}...</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, PropSync } from 'vue-property-decorator';

@Component
export default class FileLoad extends Vue {
  @PropSync('accountToImport') private account!: any;

  public onFileChange(e: any): void {
    const files = e.target.files;
    if (!files.length) {
      return;
    }
    this.createInput(files[0]);
  }

  private createInput(file: any): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.account = reader.result;
    };
    reader.readAsText(file);
  }
}
</script>
