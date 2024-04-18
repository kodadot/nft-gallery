<template>
  <DropsBasicDropCard
    :loading="!(drop.collection && !isLoadingMeta && !collectionOwnersLoading)"
    :card-is="externalUrl ? 'a' : NuxtLink"
    :to="`/${dropPrefix}/drops/${drop.alias}`"
    :name="drop.collection.name"
    :image="image"
    :show-time-tag="Boolean(drop.dropStartTime || ended)"
    :drop-start-time="drop.dropStartTime"
    :drop-status="drop.status"
    :owner-addresses="ownerAddresses"
    :drop-max="drop.max || FALLBACK_DROP_COLLECTION_MAX"
    :minted="drop.minted" />
</template>

<script setup lang="ts">
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { FALLBACK_DROP_COLLECTION_MAX } from '@/utils/drop'
import type { Metadata } from '@/components/rmrk/service/scheme'
import { Drop, DropStatus } from './useDrops'
import { resolveComponent } from 'vue'
import { Prefix } from '@kodadot1/static'
import { useCollectionActivity } from '@/composables/collectionActivity/useCollectionActivity'
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  drop: Drop
  dropUrl?: string
}>()

const isLoadingMeta = ref(false)
const image = ref('')
const externalUrl = ref()

const dropPrefix = computed(() => props.drop.chain as Prefix)
const ended = computed(() => props.drop.status === DropStatus.MINTING_ENDED)

const { owners, loading: collectionOwnersLoading } = useCollectionActivity({
  collectionId: computed(() => props.drop?.collection.collection),
  prefix: dropPrefix.value,
})
const ownerAddresses = computed(() => Object.keys(owners.value || {}))

onMounted(async () => {
  if (!props.drop?.collection) {
    return
  }

  const dropCardImage = props.drop.banner || props.drop.image

  if (dropCardImage) {
    image.value = sanitizeIpfsUrl(dropCardImage)
    return
  }

  isLoadingMeta.value = true
  const metadata = (await processSingleMetadata(
    props.drop.collection.metadata,
  )) as Metadata
  image.value = sanitizeIpfsUrl(
    metadata.image || metadata.thumbnailUri || metadata.mediaUri || '',
  )
  externalUrl.value = metadata.external_url?.match('kodadot')
    ? ''
    : metadata.external_url
  isLoadingMeta.value = false
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';
.is-ellipsis {
  @include mobile {
    white-space: unset;
  }
}
</style>
