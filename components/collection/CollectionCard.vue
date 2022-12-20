<template>
  <div class="collection-card card">
    <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
      <BasicImage
        :src="collection.image"
        :alt="collection.name"
        custom-class="collection-card__image-wrapper" />

      <CollectionDetail
        :nfts="collection.nfts"
        :name="collection.name"
        :image="collection.image" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { CollectionWithMeta } from '@/components/rmrk/service/scheme'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import CollectionDetail from './CollectionDetail.vue'
const { urlPrefix } = usePrefix()

defineProps<{
  collection: CollectionWithMeta
}>()
</script>
