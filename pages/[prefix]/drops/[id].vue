<template>
  <UnlockableCollectionBanner />
  <CollectionDropHolderOfGenerative v-if="dropType === 'holder'" />
  <CollectionDropPaidGenerative v-else-if="dropType === 'paid'" />
  <CollectionDropGenerative v-else-if="dropType === 'free'" />
</template>

<script lang="ts" setup>
import { useDrop, useDropStatus } from '@/components/drops/useDrops'
import UnlockableCollectionBanner from '@/components/collection/unlockable/UnlockableCollectionBanner.vue'
import { isProduction } from '@/utils/chain'

definePageMeta({
  layout: 'unlockable-mint-layout',
})
const { redirectAfterChainChange } = useChainRedirect()
const { urlPrefix, setUrlPrefix } = usePrefix()

const { drop, fetchDrop } = useDrop()
fetchDrop()
useDropStatus().fetchDropStatus()

const dropType = computed(() => drop.value?.type)

watchEffect(() => {
  if (drop.value?.chain === 'ahk' && isProduction) {
    useRouter().push('/')
    return
  }
  if (drop.value?.chain && urlPrefix.value !== drop.value?.chain) {
    setUrlPrefix(drop.value?.chain)
    redirectAfterChainChange(drop.value?.chain)
  }
})
</script>
