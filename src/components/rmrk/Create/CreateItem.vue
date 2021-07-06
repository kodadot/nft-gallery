<template>
  <div>
    <MetadataUpload
      v-model="vFile"
      label="Drop your NFT here or click to upload. We support various media types (bmp/ gif/ jpeg/ png/ svg/ tiff/ webp/ mp4/ ogv/ quicktime/ webm/ glb/ flac/ mp3/ json)"
      expanded
      preview
    />

    <b-field grouped :label="$i18n.t('Name')">
      <b-input
        placeholder="Name your NFT"
        v-model="vName"
        expanded
        class="mr-0"
        spellcheck="true"
      ></b-input>
      <Tooltip iconsize="is-medium" :label="$i18n.t('tooltip.name')" />
    </b-field>
    <b-field :label="$i18n.t('NFT description')" class="mb-0">
      <b-input
        v-model="vDescription"
        maxlength="500"
        type="textarea"
        placeholder="Describe your NFT"
        spellcheck="true"
      ></b-input>
    </b-field>
    <b-field grouped :label="$i18n.t('Edition')">
      <b-numberinput
        v-model="vEdition"
        placeholder="1 is minumum"
        expanded
        :min="1"
        :max="clickableMax"
      ></b-numberinput>
      <Tooltip iconsize="is-medium" :label="$i18n.t('tooltip.edition')" />
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

    <BalanceInput v-model="vPrice" label="Price" />
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
import { Component, Prop, Vue, PropSync } from 'vue-property-decorator';
import { Attribute } from '../service/scheme';
import { resolveMedia } from '../utils';
import { MediaType } from '../types';

@Component({
  components: {
    AttributeTagInput: () => import('./AttributeTagInput.vue'),
    BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
    MetadataUpload: () => import('./DropUpload.vue'),
    Tooltip: () => import('@/components/shared/Tooltip.vue'),
  }
})
export default class CreateItem extends Vue {
  @PropSync('name', { type: String }) vName!: string
  @PropSync('description', { type: String }) vDescription!: string
  @PropSync('edition', { type: Number }) vEdition!: number;
  @PropSync('nsfw', { type: Boolean }) vNsfw!: boolean;
  @PropSync('price', { type: Number }) vPrice!: string | number;
  @PropSync('tags', { type: Array }) vTags!: Attribute[];
  @PropSync('file', { type: Blob }) vFile!: Blob | null;
  @PropSync('secondFile', { type: Blob }) vSecondFile!: Blob | null;


  @Prop(Number) public max!: number;
  @Prop(Number) public alreadyMinted!: number;

  get fileType() {
    return resolveMedia(this.vFile?.type);
  }

  get secondaryFileVisible() {
    const fileType = this.fileType;
    return ![MediaType.UNKNOWN, MediaType.IMAGE].some(t => t === fileType);
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
