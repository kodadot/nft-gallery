<template>
  <div class="text-k-grey text-xs p-4 border border-k-shade">
    The images and metadata below are from its official website or on-chain data, cached by Koda. It’s our <span class="font-bold">best effort</span>, and we <span class="font-bold">don’t take any responsibility for any incorrectness</span>. You can <NuxtLink
      @click="refreshMetadata"
    >
      <span class="font-bold">request an update</span>
    </NuxtLink> or <NuxtLink
      to="https://github.com/kodadot/nft-gallery/issues/new?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen&template=bug.yml"
      target="_blank"
    >
      <span class="font-bold">report any problem</span>
    </NuxtLink> you find.
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { refreshOdaCollection, refreshOdaCollectionTokensMetadata } from '@/services/oda'

const props = defineProps<{
  collectionId: string
  chain: Prefix
}>()

const { toast } = useToastOruga()
const { $i18n } = useNuxtApp()

const refreshMetadata = () => {
  toast($i18n.t('toast.refreshMetdata'))
  refreshOdaCollection(props.chain, props.collectionId)
  refreshOdaCollectionTokensMetadata(props.chain, props.collectionId)
}
</script>
