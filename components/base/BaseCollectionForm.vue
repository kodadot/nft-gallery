<template>
  <div>
    <p class="title is-size-3">
      {{ $t(label) }}
    </p>
    <slot name="header"></slot>
    <b-field>
      <Auth />
    </b-field>

    <MetadataUpload
      ref="collectionImage"
      v-model="vFile"
      required
      :label="$t('mint.collection.drop')"
      expanded
      preview
      accept="image/png, image/jpeg, image/gif, image/svg+xml, image/svg" />

    <BasicInput
      ref="collectionName"
      v-model="vName"
      :label="$t('mint.collection.name.label')"
      :message="$t('mint.collection.name.message')"
      :placeholder="$t('mint.collection.name.placeholder')"
      expanded
      required
      spellcheck="true"
      maxlength="60" />

    <slot name="main"></slot>

    <BasicInput
      v-model="vDescription"
      maxlength="500"
      type="textarea"
      spellcheck="true"
      :label="$t('mint.collection.description.label')"
      :message="$t('mint.collection.description.message')"
      :placeholder="$t('mint.collection.description.placeholder')" />

    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Ref, Vue } from 'nuxt-property-decorator'

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload: () => import('@/components/rmrk/Create/DropUpload.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
}

@Component({ components })
export default class BaseCollectionForm extends Vue {
  @Prop({ type: String, default: 'mint.collection.create' }) label!: string
  @Prop(Boolean) protectiveMargin!: boolean
  @PropSync('name', { type: String }) vName!: string
  @PropSync('description', { type: String }) vDescription!: string
  @PropSync('file', { type: Blob }) vFile!: Blob | null

  @Ref('collectionName') readonly collectionName
  @Ref('collectionImage') readonly collectionImage
  public checkValidity() {
    return (
      this.collectionImage.checkValidity() &&
      this.collectionName.checkValidity()
    )
  }
}
</script>
