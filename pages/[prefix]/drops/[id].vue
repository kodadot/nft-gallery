<template>
  <UnlockableCollectionBanner :drop="drop" />
  <CollectionDropHolderOfGenerative v-if="dropType === 'holder'" :drop="drop" />
  <CollectionDropPaidGenerative v-else-if="dropType === 'paid'" :drop="drop" />
  <CollectionDropGenerative v-else-if="dropType === 'free'" :drop="drop" />
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
