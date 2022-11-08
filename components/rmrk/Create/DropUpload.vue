<template>
  <div class="field">
    <b-field class="file is-primary">
      <b-upload
        ref="upload"
        v-model="file"
        :required="required"
        class="file-label"
        drag-drop
        :expanded="expanded"
        :accept="accept">
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon v-if="!file && !url" :icon="icon" size="is-large" />
              <Viewport
                v-if="url && !hasError && file.type == 'model/gltf-binary'"
                :url="url" />

              <img
                v-else-if="url && !hasError"
                :src="url"
                @error="hasError = true" />
              <b-icon v-if="hasError" icon="eye-slash" size="is-large" />
            </p>
            <p v-if="!file">
              {{ label }}
            </p>
            <p v-else>
              Awesome your file is <b>{{ file.name }}</b
              >. Click or drop to change
            </p>
          </div>
        </section>
      </b-upload>
    </b-field>
    <transition v-if="checkFailed" name="fade">
      <div class="help is-danger">{{ $t('tooltip.needToUploadNFTFile') }}</div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue, Watch } from 'nuxt-property-decorator'
import Tooltip from '@/components/shared/Tooltip.vue'
import Viewport from '@/components/rmrk/Viewport.vue'

@Component({
  components: {
    Tooltip,
    Viewport: () => import('@/components/rmrk/Viewport.vue'),
  },
})
export default class DropUpload extends Vue {
  @Prop({
    default:
      'Drop your NFT here or click to upload or simply paste image from clipboard',
  })
  public label!: string
  @Prop({ default: 'upload' }) public icon!: string
  @Prop({ type: Boolean, default: false }) public required!: boolean
  @Prop(Boolean) public expanded!: boolean
  @Prop(Boolean) public preview!: boolean
  @Prop(String) public accept!: string
  private file: Blob | null = null
  protected url = ''
  protected hasError = false
  protected checkFailed = false
  @Ref('upload') readonly upload

  public checkValidity() {
    this.checkFailed = !this.file
    return !this.checkFailed
  }

  public created() {
    document.addEventListener('paste', this.onPasteImage)
  }

  public beforeDestroy() {
    document.removeEventListener('paste', this.onPasteImage)
  }

  public onPasteImage(pasteEvent: ClipboardEvent) {
    /* handling paste logic */
    const item: DataTransferItem | any = pasteEvent?.clipboardData?.items[0]
    if (item?.type.indexOf('image') === 0) {
      const blob = item.getAsFile()
      this.file = blob
      this.createInput(blob)
    }
  }

  @Watch('file')
  public createInput(file: Blob): void {
    this.checkFailed = false
    const reader = new FileReader()
    reader.onload = () => {
      // this.handleSelection(reader.result)
      // this.$consola.log(reader.si);
    }
    this.$emit('input', file)
    if (this.preview) {
      this.url = URL.createObjectURL(file)
      this.hasError = false
    }
    reader.readAsText(file)
  }

  @Emit('change')
  public handleSelection(value: string | ArrayBuffer | null) {
    return value
  }
}
</script>
