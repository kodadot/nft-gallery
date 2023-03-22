<template>
  <div class="is-flex is-align-self-flex-start">
    <SidebarFilter />
    <div class="w-full">
      <div class="columns">
        <div class="column is-two-thirds">
          <GalleryItemChart :nft-events="events" />
        </div>
        <div class="column">Auto</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarFilter from '@/components/explore/SidebarFilter.vue'
import { useCollectionActivity } from '@/components/collection/utils/useCollectionDetails'
const route = useRoute()

const collectionId = computed(() => route.params.id)
const events = useCollectionActivity({ collectionId: collectionId.value })
</script>
