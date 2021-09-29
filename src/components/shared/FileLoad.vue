<template>
  <div class="field">
    <b-field>
      <b-upload v-model="toImport"
        name="account"
        native
        drag-drop
        accept="application/json, text/plain"
        >
        <section class="section">
          <div class="has-text-centered ">
            <p>
              <b-icon
                  icon="upload"
                  size="is-large">
              </b-icon>
            </p>
            <p v-show="!account">Drop your account here or click to upload</p>
            <div class="tags">
              <span>
              {{readAccount(account)}}
              </span>
            </div>
          </div>
        </section>
      </b-upload>
    </b-field>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator'

@Component
export default class FileLoad extends Vue {
  public toImport: any = null;
  public uiReader: any = null;
  @PropSync('accountToImport', { type: String }) private account!: any;

  public readAccount(address: string): string {
  	if (address) {
  		this.uiReader = JSON.parse(address)
  		return `${this.uiReader.address.slice(0, 6)}...${this.uiReader.address.slice(-6)}
        ${this.uiReader.meta.name}`
  	}
  	return ''
  }

  @Watch('toImport')
  public createInput(file: any): void {
  	const reader = new FileReader()
  	reader.onload = () => {
  		this.account = reader.result
  	}
  	reader.readAsText(file)
  }

}
</script>
