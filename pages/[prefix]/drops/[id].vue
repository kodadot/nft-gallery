<template>
  <UnlockableCollectionBanner :drop="drop" />
  <!-- <CollectionDropHolderOfGenerative v-if="dropType === 'holder'" :drop="drop" />
  <CollectionDropPaidGenerative v-else-if="dropType === 'paid'" :drop="drop" /> -->
  <CollectionDropGenerative />
</template>

<script lang="ts" setup>
import { useDrop } from '@/components/drops/useDrops'
import UnlockableCollectionBanner from '@/components/collection/unlockable/UnlockableCollectionBanner.vue'
import { isProduction } from '@/utils/chain'

definePageMeta({
  layout: 'unlockable-mint-layout',
})
const { redirectAfterChainChange } = useChainRedirect()
const { urlPrefix, setUrlPrefix } = usePrefix()

const drop = useDrop()
const dropType = computed(() => {
  console.log(drop.value?.type)
  return 'free'
})

watch(dropType, console.log)

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
