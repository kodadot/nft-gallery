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
        <CollectionEditSection :title="$t('edit.collection.image.title')">
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
                  @clear="() => imageUrl = undefined"
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

        <CollectionEditSection :title="$t('mint.collection.banner.label')">
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
              @clear="() => bannerUrl = undefined"
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
            <NeoInput
              v-model="max"
              type="number"
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
import { NeoButton, NeoField, NeoInput, NeoModal } from '@kodadot1/brick'
import { Collections } from '@/composables/transaction/types'
import ModalBody from '@/components/shared/modals/ModalBody.vue'

export type CollectionEditMetadata = {
  image: string
  banner?: string
  max?: number
}

const emit = defineEmits(['update:value', 'submit'])
const props = defineProps<{
  modelValue: boolean
  collection?: CollectionEditMetadata
  min?: number
}>()

const isModalActive = useVModel(props, 'modelValue')

const image = ref<File | null>(null)
const banner = ref<File | null>(null)
const imageUrl = ref<string>()
const bannerUrl = ref<string>()

const { $updateLoader } = useNuxtApp()
const { transaction, status } = useTransaction()
const { urlPrefix } = usePrefix()
const route = useRoute()

const min = computed(() => props.min || 1)
const max = ref(props.collection?.max)

const disabled = computed(() => !imageUrl.value)

const editCollection = async () => {
  emit('submit')
  $updateLoader(true)

  await transaction({
    interaction: Collections.SET_MAX_SUPPLY,
    collectionId: route.params.id.toString(),
    urlPrefix: urlPrefix.value,
    max: Number(max.value),
  })

  if (status.value === TransactionStatus.Finalized) {
    $updateLoader(false)
  }
}

watch(isModalActive, (value) => {
  if (value) {
    imageUrl.value = sanitizeIpfsUrl(props.collection?.image)
  }
})

watch([image, banner], ([image, banner]) => {
  if (image) {
    imageUrl.value = URL.createObjectURL(image)
  }

  if (banner) {
    bannerUrl.value = URL.createObjectURL(banner)
  }
})
</script>
