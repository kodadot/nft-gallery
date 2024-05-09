<template>
  <div class="border-t">
    <div
      class="relative w-full mx-auto px-[1.25rem] md:px-[2.5rem] min-[1440px]:max-w-[1440px]">
      <div class="columns is-variable is-4-tablet">
        <div class="column is-half-desktop mobile-padding lg:max-w-[600px]">
          <div class="flex justify-between flex-wrap max-w-[504px]">
            <div class="mt-7 mr-2">
              <div class="font-bold is-size-5 mb-4 capitalize">
                {{ $t('tooltip.created') }}
              </div>
              <CollectionDropCreatedBy v-if="address" :address="address" />
            </div>
            <div v-if="ownerAddresses.length" class="mt-7">
              <div class="font-bold is-size-5 mb-4 capitalize">
                {{ $t('tooltip.collectedBy') }}
              </div>
              <CollectionDropCollectedBy :addresses="ownerAddresses" />
            </div>
          </div>

          <CollectionUnlockableCollectionInfo
            class="mt-7"
            :collection-id="drop?.collection"
            :description="description" />

          <hr class="hidden md:block mt-4 mb-0" />

          <CollectionDropGenerativePreview
            v-if="width < mdBreakpoint"
            @mint="emit('mint')"
            @generation:start="handleNftGeneration"
            @generation:end="handleNftGenerationEnd" />

          <CollectionDropPhase
            class="mt-28 md:mt-7"
            :drop-status="formattedDropItem?.status"
            :drop-start-time="formattedDropItem?.dropStartTime" />

          <CollectionUnlockableTag :collection-id="drop?.collection" />
        </div>

        <div
          v-if="width >= mdBreakpoint"
          class="flex-1 flex py-3 px-4 justify-end mt-[-213px]">
          <CollectionDropGenerativePreview
            @mint="emit('mint')"
            @generation:start="handleNftGeneration"
            @generation:end="handleNftGenerationEnd" />
        </div>
      </div>

      <CollectionUnlockableItemInfo :collection-id="drop?.collection" />

      <hr class="my-20" />

      <LazyCollectionDropItemsGrid
        v-if="drop?.collection"
        class="mb-14"
        :collection-id="drop?.collection" />
    </div>
  </div>

  <CollectionDropCursorParty
    :drop-alias="drop.alias"
    :user-minted-count="mintedAmountForCurrentUser" />

  <CollectionDropPartyModal />
</template>

<script setup lang="ts">
import {
  Drop,
  getFormattedDropItem,
  useDrop,
} from '@/components/drops/useDrops'
import { useCollectionActivity } from '@/composables/collectionActivity/useCollectionActivity'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { DropEventType } from '@/composables/party/types'
import { useWindowSize } from '@vueuse/core'
import { useCollectionEntity } from '@/composables/drop/useGenerativeDropMint'
import { DropItem } from '@/params/types'

const { drop } = useDrop()
const { previewItem } = storeToRefs(useDropStore())
const { mintedAmountForCurrentUser, description } = useCollectionEntity()
const { width } = useWindowSize()
const mdBreakpoint = 768

const { emitEvent, completeLastEvent } = useCursorDropEvents()
const { collection: collectionInfo } = useCollectionMinimal({
  collectionId: computed(() => drop.value?.collection ?? ''),
})

const emit = defineEmits(['mint'])
const address = computed(() => collectionInfo.value?.currentOwner)

const { owners } = useCollectionActivity({
  collectionId: computed(() => drop.value?.collection),
})
const ownerAddresses = computed(() => Object.keys(owners.value || {}))

const formattedDropItem = ref<Drop>()
watch(
  [collectionInfo],
  async () => {
    if (collectionInfo.value) {
      formattedDropItem.value = await getFormattedDropItem(
        collectionInfo.value,
        drop.value as DropItem,
      )
    }
  },
  { immediate: true },
)

const handleNftGeneration = (preview: GenerativePreviewItem) => {
  emitEvent(DropEventType.DROP_GENERATING)
  previewItem.value = preview
}

const handleNftGenerationEnd = () => {
  completeLastEvent(DropEventType.DROP_GENERATING)
}
</script>
