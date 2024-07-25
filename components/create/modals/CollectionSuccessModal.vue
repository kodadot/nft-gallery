<template>
  <div>
    <SuccessfulModal
      v-model="isModalActive"
      :tx-hash="txHash"
      :share="share"
      :status="status"
      :action-buttons="actionButtons"
    >
      <div>
        <div
          class="relative bg-cover bg-center w-full h-28 border border-k-grey-fix"
          :style="{
            backgroundImage: `url(${collection?.image})`,
          }"
        >
          <div class="flex justify-center items-center h-full">
            <div class="bg-background-color p-2 border border-k-grey-fix">
              <BaseMediaItem
                :src="collection?.image"
                :image-component="NuxtImg"
                :title="collection?.name"
                class="w-16 h-16 border border-k-grey-fix"
              />
            </div>
          </div>
        </div>

        <div class="mt-5 border-b-k-shade">
          <p class="text-base capitalize font-bold text-center">
            {{ $t('collectionCreatedModal.title') }}
          </p>
          <p class="capitalize text-xs text-center mt-2">
            {{ collection?.name }}
          </p>
        </div>
      </div>
    </SuccessfulModal>
  </div>
</template>

<script setup lang="ts">
import type { MintedCollectionInfo } from '../CreateCollection.vue'
import type { TransactionStatus } from '@/composables/useTransactionStatus'

const NuxtImg = resolveComponent('NuxtImg')
defineEmits(['modelValue'])
const props = defineProps<{
  modelValue: boolean
  txHash: string
  status: TransactionStatus
  collection?: MintedCollectionInfo
}>()

const isModalActive = useVModel(props, 'modelValue')

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const collectionPath = computed(
  () => `/${urlPrefix.value}/collection/${props.collection?.id}`,
)

const addNftsPath = computed(
  () => `/${urlPrefix.value}/create/nft?collectionId=${props.collection?.id}`,
)

const share = computed(() => ({
  text: $i18n.t('sharing.collection'),
  withCopy: true,
  url: `${window.location.origin}${collectionPath.value}`,
}))

const disabled = computed(() => !props.collection?.id)

const actionButtons = computed(() => ({
  secondary: {
    label: 'View Collection',
    onClick: handleViewCollection,
    disabled: disabled.value,
  },
  primary: {
    label: 'Add NFTs',
    onClick: handleAddNfts,
    disabled: disabled.value,
  },
}))

const handleViewCollection = () => {
  isModalActive.value = false
  navigateTo(collectionPath.value)
}

const handleAddNfts = () => {
  isModalActive.value = false
  navigateTo(addNftsPath.value)
}
</script>
