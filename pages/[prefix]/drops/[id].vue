<template>
  <UnlockableCollectionBanner />
  <CollectionDropHolderOfGenerative v-if="dropType === 'holder'" />
  <CollectionDropPaidGenerative
    v-else-if="dropType === 'paid' || dropType === 'free'" />
</template>

<script lang="ts" setup>
import { useDrop } from '@/components/drops/useDrops'
import UnlockableCollectionBanner from '@/components/collection/unlockable/UnlockableCollectionBanner.vue'

definePageMeta({
  layout: 'unlockable-mint-layout',
})
const { redirectAfterChainChange } = useChainRedirect()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { reset } = useDropStore()

const { drop, fetchDrop } = useDrop()

const dropType = computed(() => drop.value.type)

onBeforeUnmount(reset)

const fixPrefix = () => {
  if (drop.value?.chain === 'ahk' && isProduction) {
    useRouter().push('/')
    return
  }
  if (drop.value?.chain && urlPrefix.value !== drop.value?.chain) {
    setUrlPrefix(drop.value?.chain)
    redirectAfterChainChange(drop.value?.chain)
  }
}

fetchDrop().then(fixPrefix)
</script>
