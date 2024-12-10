<template>
  <NeoDropdownItem
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
import { Collections, type UpdateCollection } from '@/composables/transaction/types'

const props = defineProps<{
  collection: any
}>()

const { transaction, status, isLoading } = useTransaction()
const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const route = useRoute()

const isModalActive = ref(false)

const collectionMetadata = computed(() =>
  props.collection
    ? {
        name: props.collection.meta.name,
        description: props.collection.meta.description,
        image: props.collection.meta.image,
        imageType: props.collection.meta.type,
        banner: props.collection.meta.banner || undefined,
        max: props.collection.max,
      } as CollectionEditMetadata
    : null)

const updateMetadata = (a: UpdateCollection, b: UpdateCollection) => {
  const getMetadataKey = (m: UpdateCollection) => {
    const { max, ...rest } = m
    return JSON.stringify(rest)
  }

  return getMetadataKey(a) !== getMetadataKey(b)
}

const editCollection = async (collection: UpdateCollection) => {
  isModalActive.value = false

  if (!collectionMetadata.value) {
    return
  }

  await transaction({
    interaction: Collections.UPDATE_COLLECTION,
    collectionId: route.params.id.toString(),
    collection,
    update: {
      metadata: updateMetadata(collection, collectionMetadata.value),
      max: collection.max !== collectionMetadata.value.max,
    },
    urlPrefix: urlPrefix.value,
    successMessage: $i18n.t('edit.collection.success'),
  })
}
</script>
