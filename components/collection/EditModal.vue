<template>
  <SigningModal
    :title="$t('edit.collection.modal')"
    :is-loading="isLoading"
    :status="status"
    @try-again="editCollection"
  />

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
          <div
            v-if="imageUrl"
            class="flex gap-2"
          >
            <img
              :src="imageUrl"
              class="h-[100px] aspect-square border border-border-color object-cover"
            >

            <div
              class="flex flex-col justify-between"
            >
              <p class="text-xs capitalize">
                {{ $t('edit.collection.image.message') }}
              </p>

              <div class="flex flex-col gap-2">
                <p class="text-xs text-k-grey capitalize">
                  {{ $t('edit.collection.image.hint') }}
                </p>

                <CollectionEditOverrideFile
                  @clear="() => {
                    image = undefined
                    imageUrl = undefined
                  }"
                  @select="value => image = value"
                />
              </div>
            </div>
          </div>

          <DropUpload
            v-else
            v-model="image"
            required
            expanded
            preview
            :label="$t('edit.collection.drop')"
          />
        </CollectionEditSection>

        <CollectionEditSection :title="$t('edit.collection.banner.label')">
          <p class="text-xs !mb-4">
            {{ $t('edit.collection.banner.message') }}
          </p>

          <div
            v-if="bannerUrl"
            class="flex flex-col gap-2"
          >
            <img
              :src="bannerUrl"
              class="h-[167px] border border-border-color object-cover"
            >

            <p class="text-xs text-k-grey !mt-2">
              {{ $t('edit.collection.banner.hint') }}
            </p>

            <CollectionEditOverrideFile
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

            <p class="text-xs text-k-grey !mt-4">
              {{ $t('edit.collection.banner.hint') }}
            </p>
          </div>
        </CollectionEditSection>

        <!-- collection max nfts -->
        <NeoField
          :label="$t('Maximum NFTs in collection')"
          data-testid="collection-maxAmount"
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
              data-testid="collection-input-maximum-nfts"
              :placeholder="`${min} is the minimum`"
              :min="min"
            />

            <div class="text-k-grey text-xs !mt-2">
              This will update the Maximum items in your collection
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
import { Collections } from '@/composables/transaction/types'
import ModalBody from '@/components/shared/modals/ModalBody.vue'

export type CollectionEditMetadata = {
  name: string
  description: string
  image: string
  imageType: string
  banner?: string
  max?: number
}

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

const { transaction, status, isLoading } = useTransaction()
const { urlPrefix } = usePrefix()
const route = useRoute()

const min = computed(() => props.min || 1)
const max = ref(props.collection?.max)

const disabled = computed(() => !image.value && !banner.value && props.collection?.max === max.value)

const editCollection = async () => {
  if (!props.collection) {
    return
  }

  isModalActive.value = false

  await transaction({
    interaction: Collections.UPDATE_COLLECTION,
    collectionId: route.params.id.toString(),
    collection: {
      name: props.collection.name,
      description: props.collection.description,
      image: image.value || props.collection.image,
      imageType: props.collection.imageType,
      banner: banner.value || props.collection.banner,
      max: max.value,
    },
    urlPrefix: urlPrefix.value,
  })
}

watch(isModalActive, (value) => {
  if (value) {
    imageUrl.value = sanitizeIpfsUrl(props.collection?.image)
    bannerUrl.value = props.collection?.banner && sanitizeIpfsUrl(props.collection?.banner)
    image.value = undefined
    banner.value = undefined
    unlimited.value = !props.collection?.max
  }
})

watch([image, banner, unlimited], ([image, banner, unlimited]) => {
  if (image) {
    imageUrl.value = URL.createObjectURL(image)
  }

  if (banner) {
    bannerUrl.value = URL.createObjectURL(banner)
  }

  max.value = unlimited ? undefined : props.collection?.max
})
</script>
