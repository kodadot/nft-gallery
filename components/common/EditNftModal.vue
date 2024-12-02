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
          required
        >
          <NonRecommendFieldNotification
            :show="imageChanged"
            @undo="initImage"
          >
            <FormLogoField
              v-model:file="image"
              v-model:url="imageUrl"
            />
          </NonRecommendFieldNotification>
        </NeoField>

        <!-- nft name -->
        <NeoField
          :label="$t('mint.nft.name.label')"
          required
          :error="!name"
        >
          <NonRecommendFieldNotification
            :show="name && nameChanged"
            @undo="name = props.metadata?.name"
          >
            <NeoInput
              v-model="name"
              required
              :placeholder="$t('mint.nft.name.placeholder')"
            />
          </NonRecommendFieldNotification>
        </NeoField>

        <!-- nft description -->
        <NeoField :label="$t('mint.nft.description.label')">
          <NeoInput
            v-model="description"
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
  metadata: Metadata
}>()

const isModalActive = useVModel(props, 'modelValue')

const name = ref<string>()
const description = ref<string>()
const image = ref<File>()
const imageUrl = ref<string>()
const attributes = ref<Attribute[]>([])

const originalImageUrl = computed(() => sanitizeIpfsUrl(props.metadata?.image))

const nameChanged = computed(() => props.metadata?.name !== name.value)
const imageChanged = computed(() => originalImageUrl.value !== imageUrl.value)

const initImage = () => {
  imageUrl.value = originalImageUrl.value
  image.value = undefined
}

const disabled = computed(() => {
  const hasImage = Boolean(imageUrl.value)
  const isNameFilled = Boolean(name.value)
  const descriptionChanged = props.metadata?.description !== description.value
  const attributesChanged = JSON.stringify(attributes.value) !== JSON.stringify(props.metadata?.attributes || [])

  return !hasImage || !isNameFilled
    || (!nameChanged.value && !descriptionChanged && !imageChanged.value && !attributesChanged)
})

const editCollection = async () => {
  const { metadata } = props

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
    initImage()
    name.value = props.metadata?.name
    description.value = props.metadata?.description
    attributes.value = structuredClone(toRaw(props.metadata?.attributes || []))
  }
})
</script>
