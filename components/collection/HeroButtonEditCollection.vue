<template>
  <NeoDropdownItem
    :disabled="!collectionMetadata"
    @click="isModalActive = true"
  >
    {{ $t('moreActions.editCollection') }}
  </NeoDropdownItem>

  <SigningModal
    :title="$t('edit.collection.transaction')"
    :is-loading="isLoading"
    :status="status"
    @try-again="editCollection"
  />

  <CollectionEditModal
    v-if="collectionMetadata"
    v-model="isModalActive"
    :collection="collectionMetadata"
    :min="collection.nftCount"
    @submit="editCollection"
  />
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'
import { type CollectionEditMetadata } from '@/components/collection/EditModal.vue'
import type { CollectionMintSettingType, Collections, UpdateCollection, CollectionMintSetting } from '@/composables/transaction/types'

const props = defineProps<{
  collection: any
}>()

const { transaction, status, isLoading } = useTransaction()
const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const route = useRoute()
const collectionId = route.params.id.toString()
const collectionPermissionSettings = ref<CollectionMintSetting>()
const isModalActive = ref(false)

const collectionMetadata = computed(() =>
  props.collection && collectionPermissionSettings.value
    ? {
        name: props.collection.meta.name,
        description: props.collection.meta.description,
        image: props.collection.meta.image,
        imageType: props.collection.meta.type,
        banner: props.collection.meta.banner || undefined,
        max: props.collection.max,
        mintingSettings: collectionPermissionSettings.value!,
      } as CollectionEditMetadata
    : null)

const updateMetadata = (a: UpdateCollection, b: UpdateCollection) => {
  const getMetadataKey = (m: UpdateCollection) => {
    const { max, mintingSettings, ...rest } = m
    return JSON.stringify(rest)
  }

  return getMetadataKey(a) !== getMetadataKey(b)
}

const shouldUpdatePermission = (a: CollectionMintSetting, b: CollectionMintSetting) => {
  return a.price !== b.price || a.mintType !== b.mintType
}

const editCollection = async (collection: UpdateCollection) => {
  isModalActive.value = false

  if (!collectionMetadata.value) {
    return
  }

  await transaction({
    interaction: Collections.UPDATE_COLLECTION,
    collectionId: collectionId,
    collection,
    update: {
      metadata: updateMetadata(collection, collectionMetadata.value),
      max: collection.max !== collectionMetadata.value.max,
      permission: shouldUpdatePermission(collection.mintingSettings, collectionPermissionSettings.value!),
    },
    urlPrefix: urlPrefix.value,
    successMessage: $i18n.t('edit.collection.success'),
  })
}

watchEffect(async () => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  const config = await api.query.nfts.collectionConfigOf(collectionId)
  const mintSettings = (config.toHuman() as { mintSettings: {
    price: string
    mintType: CollectionMintSettingType
    holderOf: string
  } }).mintSettings

  mintSettings.price = mintSettings.price?.replaceAll(',', '')

  if (typeof mintSettings.mintType !== 'string') {
    mintSettings.holderOf = (mintSettings.mintType as any as { HolderOf: string }).HolderOf
    mintSettings.mintType = 'HolderOf'
  }
  collectionPermissionSettings.value = mintSettings
})
</script>
