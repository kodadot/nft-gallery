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
        <NeoField
          :label="$t('mint.collection.name.label')"
          required
          :error="!name"
        >
          <NonRecommendFieldNotification
            :show="name && nameChanged"
            @undo="name = props.collection.name"
          >
            <NeoInput
              v-model="name"
              required
              :placeholder="$t('mint.collection.name.placeholder')"
            />
          </NonRecommendFieldNotification>
        </NeoField>

        <!-- collection description -->
        <NeoField :label="$t('mint.collection.description.label')">
          <NeoInput
            v-model="description"
            type="textarea"
            has-counter
            maxlength="1000"
            height="10rem"
            :placeholder="$t('mint.collection.description.placeholder')"
          />
        </NeoField>
        <CollectionEditSection :title="$t('edit.collection.image.label')">
          <NonRecommendFieldNotification
            :show="hasImageChanged"
            @undo="initLogoImage"
          >
            <FormLogoField
              v-model:file="image"
              v-model:url="imageUrl"
              :title="$t('edit.collection.image.message')"
            />
          </NonRecommendFieldNotification>
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

        <NeoField
          :label="$t('mint.collection.permission.label')"
        >
          <div class="w-full flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <p>
                {{ $t('mint.mintType') }}
              </p>
              <NeoSelect
                v-model="selectedMintingType"
              >
                <option
                  v-for="menu in COLLECTION_MINTING_TYPES_OPTIONS"
                  :key="menu.value"
                  :value="menu.value"
                >
                  {{ menu.text }}
                </option>
              </NeoSelect>
            </div>

            <div>
              <div class="flex justify-between">
                <p>{{ $t('mint.collection.permission.noPriceSet') }}</p>
                <NeoSwitch
                  v-model="mintingPriceUnset"
                  position="left"
                />
              </div>
              <NeoInput
                v-if="!mintingPriceUnset"
                v-model="mintingPrice"
                class="mt-3"
                type="number"
                :placeholder="$t('mint.collection.permission.pricePlaceholder')"
                :min="0"
              />
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
import { NeoButton, NeoField, NeoInput, NeoModal, NeoSwitch, NeoSelect } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import type { UpdateCollection, CollectionMintSetting, CollectionMintSettingType } from '@/composables/transaction/types'

export type CollectionEditMetadata = {
  name: string
  description: string
  image: string
  imageType: string
  banner?: string
  max: number | null
  mintingSettings: CollectionMintSetting
}

const COLLECTION_MINTING_TYPES_OPTIONS = ['Issuer', 'Public', 'HolderOf'].map(type => ({ value: type as CollectionMintSettingType, text: type }))

const emit = defineEmits(['submit'])
const props = defineProps<{
  modelValue: boolean
  collection: CollectionEditMetadata
  min?: number
}>()

const isModalActive = useVModel(props, 'modelValue')

const name = ref<string>()
const description = ref<string>()
const image = ref<File>()
const banner = ref<File>()
const imageUrl = ref<string>()
const bannerUrl = ref<string>()
const unlimited = ref(true)
const mintingPriceUnset = ref(true)
const mintingPrice = ref<number | null>(null)
const selectedMintingType = ref<CollectionMintSettingType | null>(null)
const min = computed(() => props.min || 1)
const max = ref<number | null>(null)

const nameChanged = computed(() => props.collection.name !== name.value)
const hasImageChanged = computed(() => (!imageUrl.value && Boolean(props.collection.image)) || Boolean(image.value))
const originalLogoImageUrl = computed(() => sanitizeIpfsUrl(props.collection.image))
const mintTypeChanged = computed(() => selectedMintingType.value !== props.collection.mintingSettings.mintType)
const mintPriceChanged = computed(() => mintingPrice.value !== Number(props.collection.mintingSettings.price))

const disabled = computed(() => {
  const hasImage = imageUrl.value
  const isNameFilled = Boolean(name.value)

  const descriptionChanged = props.collection.description !== description.value
  const hasBannerChanged = (!bannerUrl.value && Boolean(props.collection.banner)) || Boolean(banner.value)
  const hasMaxChanged = max.value !== props.collection.max

  return !hasImage || !isNameFilled || (!nameChanged.value && !descriptionChanged && !hasImageChanged.value && !hasBannerChanged && !hasMaxChanged && !mintTypeChanged.value && !mintPriceChanged.value)
})

const initLogoImage = () => {
  imageUrl.value = originalLogoImageUrl.value
  image.value = undefined
}

const editCollection = async () => {
  emit('submit', {
    name: name.value,
    description: description.value,
    image: image.value || props.collection.image,
    imageType: props.collection.imageType,
    banner: bannerUrl.value ? banner.value || props.collection.banner : undefined,
    max: max.value,
    mintingSettings: {
      mintType: selectedMintingType.value,
      price: mintingPriceUnset.value ? null : String(mintingPrice.value),
    },
  } as UpdateCollection)
}

watch(isModalActive, (value) => {
  if (value && props.collection) {
    name.value = props.collection.name
    description.value = props.collection.description
    bannerUrl.value = props.collection.banner && sanitizeIpfsUrl(props.collection.banner)
    banner.value = undefined
    initLogoImage()
    unlimited.value = !props.collection.max
    max.value = props.collection.max

    // permission
    selectedMintingType.value = props.collection.mintingSettings.mintType
    mintingPriceUnset.value = !props.collection.mintingSettings.price
    mintingPrice.value = Number(props.collection.mintingSettings.price) || null
  }
})

watch([banner, unlimited, mintingPriceUnset], ([banner, unlimited, mintingPriceUnset]) => {
  if (banner) {
    bannerUrl.value = URL.createObjectURL(banner)
  }

  max.value = unlimited ? null : max.value || props.collection.max

  mintingPrice.value = mintingPriceUnset ? null : mintingPrice.value || Number(props.collection.mintingSettings.price)
})
</script>
