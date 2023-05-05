<template>
  <div>
    <slot name="header"></slot>

    <NeoField>
      <Auth />
    </NeoField>

    <CollectionSelect
      v-model="vSelectedCollection"
      :collections="collections"
      :show-explainer-text="showExplainerText" />

    <transition-group name="fade">
      <template v-if="vSelectedCollection">
        <MetadataUpload
          ref="upload"
          key="file"
          v-model="vFile"
          :required="true"
          :label="$t('mint.nft.drop')"
          expanded
          preview />

        <BasicInput
          ref="nftName"
          key="name"
          v-model="vName"
          required
          :label="$t('mint.nft.name.label')"
          :message="$t('mint.nft.name.message')"
          :placeholder="$t('mint.nft.name.placeholder')"
          expanded
          spellcheck="true"
          maxlength="60" />

        <BasicInput
          key="description"
          v-model="vDescription"
          maxlength="500"
          class="my-5"
          type="textarea"
          spellcheck="true"
          :label="$t('mint.nft.description.label')"
          :message="$t('mint.nft.description.message')"
          :placeholder="$t('mint.nft.description.placeholder')" />

        <BasicNumberInput
          v-if="hasEdition"
          key="edition"
          v-model="vEdition"
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
          :label="$t('mint.nft.cover')"
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
import { Component, Prop, PropSync, Ref, Vue } from 'nuxt-property-decorator'
import { MediaType } from '../rmrk/types'
import { resolveMedia } from '../rmrk/utils'
import { BaseMintedCollection as MintedCollection } from './types'
import { NeoField } from '@kodadot1/brick'

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload: () => import('@/components/rmrk/Create/DropUpload.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  BasicNumberInput: () =>
    import('@/components/shared/form/BasicNumberInput.vue'),
  CollectionSelect: () => import('@/components/base/CollectionSelect.vue'),
  NeoField,
}

@Component({ components })
export default class BaseTokenForm extends Vue {
  @Prop({ type: String, default: 'context' }) label!: string
  @Prop({ type: Array, default: () => [] }) collections!: MintedCollection[]
  @Prop({ type: Boolean, default: true }) hasEdition!: boolean
  @Prop({ type: Boolean, default: false }) showExplainerText!: boolean

  @PropSync('name', { type: String }) vName!: string
  @PropSync('description', { type: String }) vDescription!: string
  @PropSync('file', { type: Blob }) vFile!: Blob | null
  @PropSync('selectedCollection') vSelectedCollection!: MintedCollection | null
  @PropSync('edition', { type: Number }) vEdition!: number
  @PropSync('secondFile', { type: Blob }) vSecondFile!: Blob | null
  @Ref('nftName') readonly nftName
  @Ref('upload') readonly upload

  public checkValidity() {
    const nftNameValid = this.nftName.checkValidity()
    const uploadValid = this.upload.checkValidity()
    return nftNameValid && uploadValid
  }

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
