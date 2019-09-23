<template>
  <div class="field">
    <b-field>
      <b-upload v-model="toImport" 
        name="account"
        native
        drag-drop>
        <section class="section">
            <div class="content has-text-centered">
                <p>
                    <b-icon
                        icon="upload"
                        size="is-large">
                    </b-icon>
                </p>
                <p>Drop your account here or click to upload</p>
                <div class="tags">
                  <span>
                  {{account.slice(12, 30)}}
                  </span>
                </div>
            </div>
        </section>
      </b-upload>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator';

@Component
export default class FileLoad extends Vue {
  public toImport: any = null;
  @PropSync('accountToImport', { type: String }) private account!: any;

  // public onFileChange(e: any): void {
  //   const files = e.target.files;
  //   if (!files.length) {
  //     return;
  //   }
  //   this.createInput(files[0]);
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
