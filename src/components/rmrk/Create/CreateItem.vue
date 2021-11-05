<template>
  <div>
    <MetadataUpload
      v-model="vFile"
      label="Drop your NFT here or click to upload or simply paste image from clipboard. We support various media types (BMP, GIF, JPEG, PNG, SVG, TIFF, WEBP, MP4, OGV, QUICKTIME, WEBM, GLB, FLAC, MP3, JSON)"
      expanded
      preview
    />

    <BasicInput
      v-model="vName"
      :label="$t('mint.nft.name.label')"
      :message="$t('mint.nft.name.message')"
      :placeholder="$t('mint.nft.name.placeholder')"
      expanded
    />

    <BasicInput
      v-model="vDescription"
      maxlength="500"
      type="textarea"
      spellcheck="true"
      class="mb-0"
      :label="$t('mint.nft.description.label')"
      :message="$t('mint.nft.description.message')"
      :placeholder="$t('mint.nft.description.placeholder')"
    />

    <b-field :label="$i18n.t('Edition')" class="mt-5">
      <b-numberinput
        v-model="vEdition"
        placeholder="1 is minumum"
        expanded
        :min="1"
        :max="clickableMax"
      ></b-numberinput>
    </b-field>
    <MetadataUpload
      v-if="secondaryFileVisible"
      label="Your NFT requires a poster/cover to be seen in gallery. Please upload image (jpg/ png/ gif)"
      v-model="vSecondFile"
      icon="file-image"
      preview
      accept="image/png, image/jpeg, image/gif"
      expanded
    />
    <AttributeTagInput
      v-model="vTags"
      placeholder="Get discovered easier through tags"
    />

    <b-field>
      <b-switch v-model="vNsfw" :rounded="false">
        {{ vNsfw ? "NSFW" : "SFW" }}
      </b-switch>
    </b-field>

    <BalanceInput @input="updateMeta" label="Price" />
    <b-message
      v-if="hasPrice"
      icon="exclamation-triangle"
      class="mt-3 has-text-primary"
      title="Additional transaction"
      type="is-primary"
      has-icon
      aria-close-label="Close message"
    >
      <span class="has-text-primary"
        >Setting the price now requires making an additional transaction.</span
      >
    </b-message>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, PropSync } from 'vue-property-decorator'
import { Attribute } from '../service/scheme'
import { resolveMedia } from '../utils'
import { isFileWithoutType, isSecondFileVisible } from './mintUtils'

@Component({
  components: {
    AttributeTagInput: () => import('./AttributeTagInput.vue'),
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
    MetadataUpload: () => import('./DropUpload.vue'),
    Tooltip: () => import('@/components/shared/Tooltip.vue'),
    BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  }
})
export default class CreateItem extends Vue {
  @PropSync('name', { type: String }) vName!: string
  @PropSync('description', { type: String }) vDescription!: string
  @PropSync('edition', { type: Number }) vEdition!: number;
  @PropSync('nsfw', { type: Boolean }) vNsfw!: boolean;
  @PropSync('price', { type: [Number, String] }) vPrice!: string | number;
  @PropSync('tags', { type: Array }) vTags!: Attribute[];
  @PropSync('file', { type: Blob }) vFile!: Blob | null;
  @PropSync('secondFile', { type: Blob }) vSecondFile!: Blob | null;


  @Prop(Number) public max!: number;
  @Prop(Number) public alreadyMinted!: number;

  protected updateMeta(value: number) {
    console.log(typeof value, value)
    this.vPrice = value
  }

  get fileType() {
    return resolveMedia(this.vFile?.type)
  }

  get secondaryFileVisible(): boolean {
    const fileType = this.fileType
    return isFileWithoutType(this.vFile, fileType) || isSecondFileVisible(fileType)
  }

  get hasPrice() {
    return Number(this.vPrice)
  }

  get clickableMax() {
    return (this.max || Infinity) - this.alreadyMinted
  }


}
</script>

<style scoped>
.create-token-card {
  margin-bottom: 1em;
}
</style>
