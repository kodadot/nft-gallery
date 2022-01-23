<template>
  <div>
    <slot name="header"></slot>

    <b-field>
      <Auth />
    </b-field>

    <CollectionSelect
      v-model="vSelectedCollection"
      :collections="collections" />

    <transition-group name="fade">
      <template v-if="vSelectedCollection">
        <MetadataUpload
          v-model="vFile"
          key="file"
          label="Drop your NFT here or click to upload or simply paste image from clipboard. We support various media types (BMP, GIF, JPEG, PNG, SVG, TIFF, WEBP, MP4, OGV, QUICKTIME, WEBM, GLB, FLAC, MP3, JSON)"
          expanded
          preview />

        <BasicInput
          v-model="vName"
          key="name"
          :label="$t('mint.nft.name.label')"
          :message="$t('mint.nft.name.message')"
          :placeholder="$t('mint.nft.name.placeholder')"
          expanded
          spellcheck="true" />

        <BasicInput
          v-model="vDescription"
          key="description"
          maxlength="500"
          class="mb-5"
          type="textarea"
          spellcheck="true"
          :label="$t('mint.nft.description.label')"
          :message="$t('mint.nft.description.message')"
          :placeholder="$t('mint.nft.description.placeholder')" />

        <BasicNumberInput
          v-model="vEdition"
          key="edition"
          :label="$t('mint.nft.edition.label')"
          :message="$t('mint.nft.edition.message')"
          :placeholder="$t('mint.nft.edition.placeholder')"
          expanded
          :min="1"
          :max="clickableMax" />

        <MetadataUpload
          v-if="secondaryFileVisible"
          key="secondaryFile"
          v-model="vSecondFile"
          label="Your NFT requires a poster/cover to be seen in gallery. Please upload image (jpg/ png/ gif)"
          icon="file-image"
          preview
          accept="image/png, image/jpeg, image/gif"
          expanded />

        <slot name="main"></slot>

        <slot name="footer"></slot>
      </template>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { MediaType } from '../rmrk/types'
import { resolveMedia } from '../rmrk/utils'
import { MintedCollection } from './types'

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload: () => import('@/components/rmrk/Create/DropUpload.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  BasicNumberInput: () =>
    import('@/components/shared/form/BasicNumberInput.vue'),
  CollectionSelect: () => import('@/components/base/CollectionSelect.vue'),
}

@Component({ components })
export default class BaseTokenForm extends Vue {
  @Prop({ type: String, default: 'context' }) label!: string
  @Prop({ type: Array, default: () => [] }) collections!: MintedCollection[]

  @PropSync('name', { type: String }) vName!: string
  @PropSync('description', { type: String }) vDescription!: string
  @PropSync('file', { type: Blob }) vFile!: Blob | null
  @PropSync('selectedCollection') vSelectedCollection!: MintedCollection | null
  @PropSync('edition', { type: Number }) vEdition!: number
  @PropSync('secondFile', { type: Blob }) vSecondFile!: Blob | null

  get clickableMax() {
    return Infinity
    // return (this.max || Infinity) - this.alreadyMinted
  }

  get fileType() {
    return resolveMedia(this.vFile?.type)
  }

  get secondaryFileVisible() {
    const fileType = this.fileType
    return ![MediaType.UNKNOWN, MediaType.IMAGE].some((t) => t === fileType)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
