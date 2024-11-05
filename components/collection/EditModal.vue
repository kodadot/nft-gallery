<template>
  <NeoModal
    :value="isModalActive"
    @close="isModalActive = false"
  >
    <ModalBody
      :title="$t('edit.collection.title')"
      :scrollable="false"
      @close="isModalActive = false"
    >
      <form
        class="flex flex-col gap-6"
        @submit.prevent
      >
        <CollectionEditSection :title="$t('edit.collection.image.label')">
          <FormLogoField
            v-model:file="image"
            v-model:url="imageUrl"
            :title="$t('edit.collection.image.message')"
          />
        </CollectionEditSection>

        <CollectionEditSection :title="$t('edit.collection.banner.label')">
          <p class="text-xs !mb-4 capitalize">
            {{ $t('edit.collection.banner.message') }}
          </p>

          <div
            v-if="bannerUrl"
            class="flex flex-col gap-2"
          >
            <img
              alt="collection banner"
              :src="bannerUrl"
              class="h-[167px] border border-border-color object-cover"
            >

            <p class="text-xs text-k-grey !mt-2 capitalize">
              {{ $t('edit.collection.banner.hint') }}
            </p>

            <FormOverrideFile
              @clear="() => {
                banner = undefined
                bannerUrl = undefined
              }"
              @select="value => banner = value"
            />
          </div>

          <div
            v-else
          >
            <DropUpload
              v-model="banner"
              required
              expanded
              preview
              :label="$t('edit.collection.drop')"
            />

            <p class="text-xs text-k-grey !mt-4 capitalize">
              {{ $t('edit.collection.banner.hint') }}
            </p>
          </div>
        </CollectionEditSection>

        <!-- collection max nfts -->
        <NeoField
          :label="$t('edit.collection.max.label')"
          required
        >
          <div class="w-full">
            <div class="flex justify-between">
              <p>{{ $t('mint.unlimited') }}</p>
              <NeoSwitch
                v-model="unlimited"
                position="left"
              />
            </div>
            <NeoInput
              v-if="!unlimited"
              v-model="max"
              class="mt-3"
              type="number"
              :placeholder="`${min} is the minimum`"
              :min="min"
            />

            <div class="text-k-grey text-xs !mt-2">
              {{ $t('edit.collection.max.hint') }}
            </div>
          </div>
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
import { NeoButton, NeoField, NeoInput, NeoModal, NeoSwitch } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import type { UpdateCollection } from '@/composables/transaction/types'

export type CollectionEditMetadata = {
  name: string
  description: string
  image: string
  imageType: string
  banner?: string
  max: number | null
}

const emit = defineEmits(['submit'])
const props = defineProps<{
  modelValue: boolean
  collection?: CollectionEditMetadata
  min?: number
}>()

const isModalActive = useVModel(props, 'modelValue')

const image = ref<File>()
const banner = ref<File>()
const imageUrl = ref<string>()
const bannerUrl = ref<string>()
const unlimited = ref(true)

const min = computed(() => props.min || 1)
const max = ref<number | null>(null)

const disabled = computed(() => {
  const hasImage = imageUrl.value

  const hasImagechanged = (!imageUrl.value && Boolean(props.collection?.image)) || Boolean(image.value)
  const hasBannerChanged = (!bannerUrl.value && Boolean(props.collection?.banner)) || Boolean(banner.value)
  const hasMaxChanged = max.value !== props.collection?.max

  return !hasImage || (!hasImagechanged && !hasBannerChanged && !hasMaxChanged)
})

const editCollection = async () => {
  if (!props.collection) {
    return
  }

  emit('submit', {
    name: props.collection.name,
    description: props.collection.description,
    image: image.value || props.collection.image,
    imageType: props.collection.imageType,
    banner: bannerUrl.value ? banner.value || props.collection.banner : undefined,
    max: max.value,
  } as UpdateCollection)
}

watch(isModalActive, (value) => {
  if (value && props.collection) {
    imageUrl.value = sanitizeIpfsUrl(props.collection.image)
    bannerUrl.value = props.collection.banner && sanitizeIpfsUrl(props.collection.banner)
    image.value = undefined
    banner.value = undefined
    unlimited.value = !props.collection.max
    max.value = props.collection.max
  }
})

watch([banner, unlimited], ([banner, unlimited]) => {
  if (!props.collection) {
    return
  }

  if (banner) {
    bannerUrl.value = URL.createObjectURL(banner)
  }

  max.value = unlimited ? null : max.value || props.collection.max
})
</script>
