<template>
  <div>
    <slot name="header"></slot>

    <NeoField>
      <Auth />
    </NeoField>

    <CollectionSelect
      :collections="collections"
      :show-explainer-text="showExplainerText"
      @change-selected-collection="onCollectionSelected" />

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
          v-if="hasCopies"
          key="copies"
          v-model="vCopies"
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

<script setup lang="ts">
import { MediaType } from '../rmrk/types'
import { resolveMedia } from '../rmrk/utils'
import { BaseMintedCollection as MintedCollection } from './types'
import { NeoField } from '@kodadot1/brick'
import Auth from '@/components/shared/Auth.vue'
import MetadataUpload from '@/components/shared/DropUpload.vue'
import BasicInput from '@/components/shared/form/BasicInput.vue'
import BasicNumberInput from '@/components/shared/form/BasicNumberInput.vue'
import CollectionSelect from '@/components/base/CollectionSelect.vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  label: {
    type: String,
    default: 'context',
  },
  collections: {
    type: Array,
    default: () => [],
  },
  hasCopies: {
    type: Boolean,
    default: true,
  },
  showExplainerText: {
    type: Boolean,
    default: false,
  },
  name: String,
  description: String,
  file: Blob,
  selectedCollection: Object,
  copies: Number,
  secondFile: Blob,
})

const emit = defineEmits([
  'update:name',
  'update:description',
  'update:file',
  'update:selectedCollection',
  'update:copies',
  'update:secondFile',
])

const nftName = ref<InstanceType<typeof BasicInput>>()
const upload = ref<InstanceType<typeof MetadataUpload>>()

const vName = useVModel(props, 'name', emit)

const vDescription = useVModel(props, 'description', emit)

const vFile = useVModel(props, 'file', emit)

// const vSelectedCollection = useVModel(props, 'selectedCollection', emit)
const vSelectedCollection = ref()

const vCopies = useVModel(props, 'copies', emit)

const vSecondFile = useVModel(props, 'secondFile', emit)

const checkValidity = () => {
  const nftNameValid = nftName.value?.checkValidity()
  const uploadValid = upload.value?.checkValidity()
  return nftNameValid && uploadValid
}

const onCollectionSelected = (collection: MintedCollection) => {
  vSelectedCollection.value = collection
}

const clickableMax = ref(Infinity)

const fileType = computed(() => resolveMedia(vFile.value?.type))

const secondaryFileVisible = computed(() => {
  const ft = fileType.value
  return ![MediaType.UNKNOWN, MediaType.IMAGE].some((t) => t === ft)
})

defineExpose({ checkValidity })
</script>
