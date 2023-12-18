<template>
  <InfoBox v-if="isHolderOfCollection && alreadyClaimed" variant="warning">
    <div class="is-flex is-align-items-center">
      <NeoIcon icon="triangle-exclamation" class="mr-2" />
      <span> {{ $t('drops.holderOfClaimed', [exclusiveCollectionName]) }}</span>
    </div>
  </InfoBox>
</template>

<script setup lang="ts">
import InfoBox from '@/components/shared/view/InfoBox.vue'
import { MINT_ADDRESS } from '@/components/collection/drop/const'
import { NeoIcon } from '@kodadot1/brick'
import { NFT } from '@/components/rmrk/service/scheme'
import { Interaction } from '@kodadot1/minimark/v1'

const props = defineProps<{
  nft: NFT
}>()

const alreadyClaimed = ref(false)
const exclusiveCollectionName = ref('')

const isHolderOfCollection = computed(() =>
  Object.keys(HOLDER_OF_DROP_MAP).includes(props.nft.collection.id),
)

const owners = computed(() => {
  const set = new Set([
    ...(props.nft?.events?.map((event) => event.currentOwner).filter(Boolean) ||
      []),
    props.nft.currentOwner,
  ])

  set.delete(MINT_ADDRESS)

  return [...set]
})

const exclusiveCollectionId = HOLDER_OF_DROP_MAP[props.nft.collection.id]

const { data } = useSearchNfts({
  search: {
    collection: { id_eq: exclusiveCollectionId },
    events_some: {
      AND: {
        interaction_eq: Interaction.MINT,
        currentOwner_in: owners.value,
      },
    },
  },
})

watch(data, () => {
  const { nFTEntities } = data.value

  if (nFTEntities.length) {
    alreadyClaimed.value = true
    exclusiveCollectionName.value = nFTEntities[0].collection.name
  }
})
</script>

<style scoped></style>
