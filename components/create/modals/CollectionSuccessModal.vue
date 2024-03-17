<template>
  <div>
    <SuccessfulModal
      v-model="isModalActive"
      :tx-hash="txHash"
      :share="share"
      :action-buttons="actionButtons">
      <div>
        <div
          class="relative bg-cover bg-center w-full h-28 border border-k-grey-fix"
          :style="{
            backgroundImage: `url(${avatar})`,
          }">
          <div class="flex justify-center items-center h-full">
            <div class="bg-background-color p-2 border border-k-grey-fix">
              <BaseMediaItem
                :src="avatar"
                :image-component="NuxtImg"
                :title="collection?.name"
                class="w-16 h-16 border border-k-grey-fix" />
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
import { MintedCollectionInfo } from '../CreateCollection.vue'

const NuxtImg = resolveComponent('NuxtImg')
defineEmits(['modelValue'])
const props = defineProps<{
  modelValue: boolean
  txHash: string
  collection?: MintedCollectionInfo
}>()

const isModalActive = useVModel(props, 'modelValue')

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const avatar = computed(() => sanitizeIpfsUrl(props.collection?.meta?.image))

const collectionPath = computed(
  () => `/${urlPrefix.value}/collection/${props.collection?.id}`,
)

const addNftsPath = computed(() => `/${urlPrefix.value}/create/nft`)

const share = computed(() => ({
  text: $i18n.t('sharing.collection'),
  withCopy: true,
  url: `${window.location.origin}${collectionPath.value}`,
}))

const actionButtons = computed(() => ({
  secondary: {
    label: 'View Collection',
    onClick: handleViewCollection,
  },
  primary: {
    label: 'Add NFTs',
    onClick: handleAddNfts,
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
