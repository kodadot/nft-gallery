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
            :show="Boolean(name && nameChanged)"
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
          <p class="text-xs mb-4! capitalize">
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

            <p class="text-xs text-k-grey mt-2! capitalize">
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

            <p class="text-xs text-k-grey mt-4! capitalize">
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

            <div class="text-k-grey text-xs mt-2!">
              {{ $t('edit.collection.max.hint') }}
            </div>
          </div>
        </NeoField>

        <NeoField
          v-if="isModalActive"
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
              <div class="flex justify-between capitalize">
                <p>{{ $t(hasMintingPrice ? 'mint.collection.permission.pricePlaceholder' : 'mint.collection.permission.noPriceSet') }}</p>
                <NeoSwitch
                  v-if="isHolderOfMintingTypeSelected"
                  v-model="hasMintingPrice"
                  position="left"
                />
              </div>
              <div
                v-if="hasMintingPrice"
                class="flex focus-within:border-border-color! border border-k-shade h-12 mt-3"
              >
                <input
                  v-model="mintingPrice"
                  type="number"
                  step="0.01"
                  min="0.0001"
                  pattern="[0-9]+([\.,][0-9]+)?"
                  class="indent-2.5 border-none outline-hidden bg-background-color text-text-color w-full"
                  :placeholder="$t('mint.collection.permission.pricePlaceholder')"
                >
                <div class="px-3 flex items-center">
                  {{ chainSymbol }}
                </div>
              </div>
              <div
                v-if="isHolderOfMintingTypeSelected"
                class="mt-4"
              >
                <p class="mb-2">
                  {{ $t('mint.collection.permission.holderOfCollection') }}
                </p>
                <CollectionSearchInput
                  :collection-id="holderOfCollectionId"
                  @update:collection="holderOfCollectionId = $event?.collection_id"
                />
              </div>
            </div>

            <div class="flex flex-col w-full">
              <div
                v-if="permissionSettingWarningMessage"
                class="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2!"
              >
                <KIcon
                  name="i-mdi:alert-circle-outline"
                  class="text-yellow-500"
                  size="small"
                />

                <p class="text-sm text-yellow-700">
                  {{ permissionSettingWarningMessage }}
                </p>
              </div>
            </div>
          </div>
        </NeoField>
      </form>

      <div class="flex flex-col mt-6!">
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
import { type UpdateCollection, type CollectionMintSetting, CollectionMintSettingType } from '@/composables/transaction/types'

export type CollectionEditMetadata = {
  name: string
  description: string
  image: string
  imageType: string
  banner?: string
  max: number | null
  mintingSettings: CollectionMintSetting
}

const COLLECTION_MINTING_TYPES_OPTIONS = ([CollectionMintSettingType.Issuer, CollectionMintSettingType.Public, CollectionMintSettingType.HolderOf]).map(type => ({ value: type, text: type }))

const emit = defineEmits(['submit'])
const props = defineProps<{
  modelValue: boolean
  collection: CollectionEditMetadata
  min?: number
}>()

const { $i18n } = useNuxtApp()
const isModalActive = useVModel(props, 'modelValue')
const { chainSymbol, decimals, withDecimals } = useChain()

const name = ref<string>()
const description = ref<string>()
const image = ref<File>()
const banner = ref<File>()
const imageUrl = ref<string>()
const bannerUrl = ref<string>()
const unlimited = ref(true)
const hasMintingPrice = ref(false)
const mintingPrice = ref<number | null>(null)

const selectedMintingType = ref<CollectionMintSettingType | null>(null)
const min = computed(() => props.min || 1)
const max = ref<number | null>(null)

const nameChanged = computed(() => props.collection.name !== name.value)
const hasImageChanged = computed(() => (!imageUrl.value && Boolean(props.collection.image)) || Boolean(image.value))
const originalLogoImageUrl = computed(() => sanitizeIpfsUrl(props.collection.image))
const mintTypeChanged = computed(() => selectedMintingType.value !== props.collection.mintingSettings.mintType)
const mintPriceChanged = computed(() => mintingPrice.value !== originalMintPrice.value)
const originalMintPrice = computed(() => props.collection.mintingSettings.price ? Number(props.collection.mintingSettings.price) / (10 ** decimals.value) : null)
const originalHolderOfCollectionId = computed(() => props.collection.mintingSettings.holderOf)
const holderOfCollectionId = ref<string | undefined>(originalHolderOfCollectionId.value)
const isHolderOfMintingTypeSelected = computed(() => selectedMintingType.value === CollectionMintSettingType.HolderOf)

const disabled = computed(() => {
  const hasImage = imageUrl.value
  const isNameFilled = Boolean(name.value)

  const descriptionChanged = props.collection.description !== description.value
  const hasBannerChanged = (!bannerUrl.value && Boolean(props.collection.banner)) || Boolean(banner.value)
  const hasMaxChanged = max.value !== props.collection.max
  const holderOfCollectionIdChanged = holderOfCollectionId.value !== originalHolderOfCollectionId.value
  const invalidPublicCollection = selectedMintingType.value === 'Public' && !mintingPrice.value

  const invalidHolderOfCollection = isHolderOfMintingTypeSelected.value && !holderOfCollectionId.value

  return !hasImage || !isNameFilled || invalidHolderOfCollection || invalidPublicCollection
    || (!nameChanged.value && !descriptionChanged && !hasImageChanged.value && !hasBannerChanged && !hasMaxChanged && !mintTypeChanged.value && !mintPriceChanged.value && !holderOfCollectionIdChanged)
})

const permissionSettingWarningMessage = computed(() => selectedMintingType.value && permissionSettingCheckingMap[selectedMintingType.value]?.())

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
      price: hasMintingPrice.value ? String(withDecimals(mintingPrice.value || 0)) : null,
      holderOf: holderOfCollectionId.value || originalHolderOfCollectionId.value,
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
    hasMintingPrice.value = Boolean(props.collection.mintingSettings.price)
    mintingPrice.value = originalMintPrice.value || null
    holderOfCollectionId.value = originalHolderOfCollectionId.value
  }
}, {
  immediate: true,
})
const mintTypeChangeHandlerMap: Record<CollectionMintSettingType, () => void> = {
  [CollectionMintSettingType.Issuer]: () => {
    hasMintingPrice.value = false
    mintingPrice.value = null
  },
  [CollectionMintSettingType.Public]: () => {
    hasMintingPrice.value = true
    mintingPrice.value = null
  },
  [CollectionMintSettingType.HolderOf]: () => {
    hasMintingPrice.value = false
    mintingPrice.value = null
    holderOfCollectionId.value = undefined
  },
}

const permissionSettingCheckingMap: Record<CollectionMintSettingType, () => string | undefined> = {
  [CollectionMintSettingType.Issuer]: () => {
    if (mintingPrice.value) {
      return $i18n.t('mint.collection.permission.issuerWarning')
    }
  },
  [CollectionMintSettingType.Public]: () => {
    if (!mintingPrice.value || mintingPrice.value <= 0) {
      return $i18n.t('mint.collection.permission.publicWarning')
    }
    return $i18n.t('mint.collection.permission.publicWithPriceWarning')
  },
  [CollectionMintSettingType.HolderOf]: () => {
    if (!holderOfCollectionId.value) {
      return $i18n.t('mint.collection.permission.holderOfIdWarning')
    }
    return $i18n.t('mint.collection.permission.holderOfWarning')
  },
}

watch(selectedMintingType, (type, oldType) => {
  if (oldType && type && mintTypeChangeHandlerMap[type]) {
    mintTypeChangeHandlerMap[type]()
  }
})

watch([banner, unlimited], ([banner, unlimited]) => {
  if (banner) {
    bannerUrl.value = URL.createObjectURL(banner)
  }

  max.value = unlimited ? null : max.value || props.collection.max
})
</script>
