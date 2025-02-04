<template>
  <div>
    <CollectionBanner
      :collection-id="collectionId"
      :collection="collection"
    />
    <section class="pt-5">
      <div class="grow relative w-full max-w-none mx-auto my-0 !px-10">
        <CollectionInfo
          ref="collectionInfo"
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

const collectionInfo = ref()

const { toast } = useToast()
const { $i18n } = useNuxtApp()
const route = useRoute()
const collectionId = computed(() => route.params.id.toString())

const { collection, refetch } = useCollectionMinimal({
  collectionId,
})

useSubscriptionGraphql({
  query: `
    collectionEntity: collectionEntityById(id: "${collectionId.value}") {
      max
      metadata
    }
  `,
  onChange: () => {
    toast($i18n.t('edit.collection.updated'))
    refetch()
    collectionInfo.value?.refetch()
  },
  immediate: false,
})

watch(collectionId, () => refetch())
</script>
