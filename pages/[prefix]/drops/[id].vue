<template>
  <UnlockableCollectionBanner :drop="drop" />
  <CollectionDropContainer v-if="dropType === 'paid'" :drop="drop" />
  <CollectionDropHolderOfGenerative
    v-else-if="dropType === 'generative' && drop.alias === 'flatwhite'"
    :drop="drop" />
  <CollectionDropGenerative
    v-else-if="dropType === 'generative'"
    :drop="drop" />
  <CollectionUnlockableContainer v-else-if="dropType === 'drop'" :drop="drop" />
  <CollectionVoteDropContainer v-else-if="dropType === 'vote'" :drop="drop" />
</template>

<script lang="ts" setup>
import { useDrop } from '@/components/drops/useDrops'
import UnlockableCollectionBanner from '@/components/collection/unlockable/UnlockableCollectionBanner.vue'

definePageMeta({
  layout: 'unlockable-mint-layout',
})
const { params } = useRoute()

const drop = await useDrop(params.id.toString())
const dropType = computed(() => drop?.type)
</script>
