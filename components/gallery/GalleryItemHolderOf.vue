<template>
  <InfoBox v-if="showWarning" variant="warning">
    <div class="flex items-center">
      <NeoIcon icon="triangle-exclamation" class="mr-2" />
      <span> {{ $t('drops.holderOfClaimed', [exclusiveDrop?.name]) }}</span>
    </div>
  </InfoBox>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { NFT } from '@/components/rmrk/service/scheme'
import { useDrop, useHolderOfCollectionDrop } from '../drops/useDrops'
import {
  DROP_COLLECTION_TO_ALIAS_MAP,
  FALLBACK_DROP_COLLECTION_MAX,
  HOLDER_OF_DROP_MAP,
} from '@/utils/drop'

const props = defineProps<{
  nft: NFT
}>()

const { isNftClaimed } = useHolderOfCollectionDrop()

const isHolderOfCollection = computed(() =>
  Object.keys(HOLDER_OF_DROP_MAP).includes(props.nft.collection.id),
)

const exclusiveCollectionId = HOLDER_OF_DROP_MAP[props.nft.collection.id]

const { drop: exclusiveDrop } = useDrop(
  DROP_COLLECTION_TO_ALIAS_MAP[exclusiveCollectionId],
)

const hasAvailable = computed(() => {
  const chainMax = exclusiveDrop.value?.max ?? FALLBACK_DROP_COLLECTION_MAX
  return Math.min(exclusiveDrop.value?.minted || 0, chainMax) < chainMax
})

const checkIfAlreadyClaimed = async () =>
  isNftClaimed(props.nft.sn, props.nft.collection.id, exclusiveCollectionId)

const isActiveDrop = computed(
  () =>
    Boolean(exclusiveDrop) &&
    !exclusiveDrop.value?.disabled &&
    hasAvailable.value,
)

const showWarning = computed(
  () =>
    isHolderOfCollection.value && alreadyClaimed.value && isActiveDrop.value,
)

const { data: alreadyClaimed } = useAsyncData(
  'checkIfAlreadyClaimed',
  checkIfAlreadyClaimed,
)
</script>
