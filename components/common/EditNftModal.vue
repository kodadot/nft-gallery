<template>
  <NeoModal
    :value="isModalActive"
    @close="isModalActive = false"
  >
    <ModalBody
      :title="$t('edit.nft.title')"
      :scrollable="false"
      @close="isModalActive = false"
    >
      <form
        class="flex flex-col gap-6"
        @submit.prevent
      >
        <NeoField
          :label="$t('mint.nft.art.label')"
          data-testid="nft-image"
          required
        >
          <FormLogoField
            v-model:file="image"
            v-model:url="imageUrl"
          />
        </NeoField>

        <!-- nft name -->
        <NeoField
          :label="$t('mint.nft.name.label')"
          required
          :error="!name"
        >
          <NeoInput
            v-model="name"
            data-testid="create-nft-input-name"
            required
            :placeholder="$t('mint.nft.name.placeholder')"
          />
        </NeoField>

        <!-- nft description -->
        <NeoField :label="$t('mint.nft.description.label')">
          <NeoInput
            v-model="description"
            data-testid="create-nft-input-description"
            type="textarea"
            has-counter
            maxlength="1000"
            height="10rem"
            :placeholder="$t('mint.nft.description.placeholder')"
          />
        </NeoField>

        <!-- nft properties -->
        <NeoField :label="$t('tabs.properties')">
          <CustomAttributeInput
            v-model="attributes"
            :max="10"
            data-testid="create-nft-properties"
          />
        </NeoField>
      </form>

      <div class="flex flex-col !mt-6">
        <NeoButton
          variant="primary"
          size="large"
          :disabled="disabled"
          no-shadow
          :label="$t('edit.collection.saveChanges')"
          @click="editCollection"
        />
      </div>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoField, NeoInput, NeoModal } from '@kodadot1/brick'
import type { Metadata, Attribute } from '@kodadot1/minimark/common'
import type { ActionMetadataSetMetadata } from '@/composables/transaction/types'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import CustomAttributeInput from '@/components/rmrk/Create/CustomAttributeInput.vue'

const emit = defineEmits(['submit'])
const props = defineProps<{
  modelValue: boolean
  metadata?: Metadata
}>()

const isModalActive = useVModel(props, 'modelValue')

const name = ref<string>()
const description = ref<string>()
const image = ref<File>()
const imageUrl = ref<string>()
const attributes = ref<Attribute[]>([])

const disabled = computed(() => {
  const hasImage = Boolean(imageUrl.value)
  const isNameFilled = Boolean(name.value)

  const nameChanged = props.metadata?.name !== name.value
  const descriptionChanged = props.metadata?.description !== description.value
  const imageChanged = Boolean(image.value)
  const attributesChanged = JSON.stringify(attributes.value) !== JSON.stringify(props.metadata?.attributes || [])

  return !hasImage || !isNameFilled
    || (!nameChanged && !descriptionChanged && !imageChanged && !attributesChanged)
})

const editCollection = async () => {
  const { metadata } = props

  if (!metadata) {
    return
  }

  emit('submit', {
    ...metadata,
    image: image.value || metadata.image,
    name: name.value,
    description: description.value,
    attributes: attributes.value,
  } as ActionMetadataSetMetadata)
}

watch(isModalActive, (value) => {
  if (value) {
    imageUrl.value = sanitizeIpfsUrl(props.metadata?.image)
    image.value = undefined
    name.value = props.metadata?.name
    description.value = props.metadata?.description
    attributes.value = structuredClone(toRaw(props.metadata?.attributes || []))
  }
})
</script>
