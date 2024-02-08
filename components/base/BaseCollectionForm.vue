<template>
  <div>
    <h2 class="title text-3xl">
      {{ $t(label) }}
    </h2>
    <slot name="header"></slot>
    <NeoField>
      <Auth />
    </NeoField>

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

<script setup lang="ts">
import { NeoField } from '@kodadot1/brick'
import Auth from '@/components/shared/Auth.vue'
import MetadataUpload from '@/components/shared/DropUpload.vue'
import BasicInput from '@/components/shared/form/BasicInput.vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  label: {
    type: String,
    default: 'mint.collection.create',
  },
  protectiveMargin: Boolean,
  name: String,
  description: String,
  file: Blob,
})
const emit = defineEmits(['update:name', 'update:description', 'update:file'])

const vName = useVModel(props, 'name', emit)

const vDescription = useVModel(props, 'description', emit)

const vFile = useVModel(props, 'file', emit)

const collectionName = ref<InstanceType<typeof BasicInput>>()
const collectionImage = ref<InstanceType<typeof MetadataUpload>>()

const checkValidity = () => {
  return (
    collectionImage.value?.checkValidity() &&
    collectionName.value?.checkValidity()
  )
}

defineExpose({ checkValidity })
</script>
