<template>
  <NeoDropdownItem
    @click="isModalActive = true"
  >
    {{ $t('moreActions.editCollection') }}
  </NeoDropdownItem>

  <CollectionEditModal
    v-model="isModalActive"
    :collection="collectinoMetadata"
    :min="collection.nftCount"
    @submit="isModalActive = false"
  />
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'
import { type CollectionEditMetadata } from '@/components/collection/EditModal.vue'

const props = defineProps<{
  collection: any
}>()

const isModalActive = ref(false)

const collectinoMetadata = computed<CollectionEditMetadata>(() => ({
  image: props.collection.meta.image,
  banner: props.collection.meta.banner,
  max: props.collection.max,
}))
</script>
