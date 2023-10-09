<template>
  <CollectionDropContainer v-if="dropType === 'paid'" :drop="drop" />
  <CollectionUnlockableContainer v-else-if="dropType === 'drop'" :drop="drop" />
  <CollectionVoteDropContainer v-else-if="dropType === 'vote'" :drop="drop" />
</template>

<script lang="ts" setup>
import { useDrop } from '@/components/drops/useDrops'

definePageMeta({
  layout: 'unlockable-mint-layout',
})
const { params } = useRoute()

const drop = await useDrop(params.id)
const dropType = computed(() => drop?.type)
</script>
