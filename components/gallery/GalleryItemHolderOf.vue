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
import { useDrop } from '../drops/useDrops'

const props = defineProps<{
  nft: NFT
}>()

const { apiInstance } = useApi()

const isHolderOfCollection = computed(() =>
  Object.keys(HOLDER_OF_DROP_MAP).includes(props.nft.collection.id),
)

const exclusiveCollectionId = HOLDER_OF_DROP_MAP[props.nft.collection.id]

const exclusiveDrop = await useDrop(
  DROP_COLLECTION_TO_ALIAS_MAP[exclusiveCollectionId],
)

const hasAvailable = computed(() => {
  const chainMax = exclusiveDrop?.max ?? FALLBACK_DROP_COLLECTION_MAX
  return Math.min(exclusiveDrop?.minted || 0, chainMax) < chainMax
})

const checkIfAlreadyClaimed = async () => {
  const api = await apiInstance.value

  const claimed = await api.query.nfts.attribute(
    props.nft.collection.id,
    props.nft.sn,
    { Pallet: null },
    '0x0033000000',
  )

  const wasUsed = claimed.toHuman()

  return wasUsed !== null
}

const isActiveDrop = computed(
  () => Boolean(exclusiveDrop) && !exclusiveDrop.disabled && hasAvailable.value,
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
