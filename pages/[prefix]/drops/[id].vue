<template>
  <UnlockableCollectionBanner :drop="drop" />
  <CollectionDropContainer v-if="dropType === 'paid'" :drop="drop" />
  <CollectionDropMultiPhaseGenerative
    v-else-if="dropType === 'generative' && drop.holds"
    :drop="drop" />
  <CollectionDropPaidGenerative
    v-else-if="dropType === 'generative' && Number(drop.price)"
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
import { isProduction } from '@/utils/chain'

definePageMeta({
  layout: 'unlockable-mint-layout',
})
const { params } = useRoute()
const { redirectAfterChainChange } = useChainRedirect()
const { urlPrefix, setUrlPrefix } = usePrefix()

const drop = await useDrop(params.id.toString())
const dropType = computed(() => drop?.type)

onMounted(() => {
  if (drop?.chain === 'ahk' && isProduction) {
    useRouter().push('/')
    return
  }
  if (drop?.chain && urlPrefix.value !== drop?.chain) {
    setUrlPrefix(drop?.chain)
    redirectAfterChainChange(drop?.chain)
  }
})
</script>
