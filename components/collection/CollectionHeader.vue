<template>
  <div>
    <CollectionBanner
      :collection-id="collectionId"
      :collection="collection"
    />
    <section class="pt-5">
      <div class="container is-fluid">
        <CollectionInfo
          :collection-id="collectionId"
          :collection="collection"
        />
        <hr class="!bg-k-grey mb-0">
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import CollectionInfo from '@/components/collection/CollectionInfo.vue'
import CollectionBanner from '@/components/collection/CollectionHeader/CollectionBanner.vue'

const route = useRoute()
const collectionId = computed(() => route.params.id.toString())

const { collection, refetch } = useCollectionMinimal({
  collectionId,
})

watch(collectionId, () => refetch())
</script>
