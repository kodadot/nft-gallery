<template>
  <div>
    <div
      v-if="drop.collection && !isLoadingMeta"
      class="border border-card-border-color hover:border-border-color bg-background-color group">
      <component
        :is="externalUrl ? 'a' : NuxtLink"
        class="flex flex-col hover:text-text-color"
        rel="nofollow noopener noreferrer"
        :to="`/${dropPrefix}/drops/${drop.alias}`">
        <img
          :src="image"
          :alt="drop.collection.name"
          class="group-hover:opacity-[0.85] aspect-video object-cover w-full" />

        <div
          class="min-h-[115px] py-5 px-2 sm:px-5 flex flex-col justify-between gap-4 border-t border-card-border-color">
          <span
            class="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-xl"
            >{{ drop.collection.name }}</span
          >

          <div
            class="h-[28px] flex justify-between items-center flex-wrap gap-y-4 gap-x-2">
            <div>
              <span>{{ mintedCount }}</span
              ><span class="text-k-grey">/{{ drop.max }}</span>
            </div>
            <TimeTag
              v-if="drop.dropStartTime && !ownerAddresses.length"
              :drop-start-time="drop.dropStartTime"
              :drop-status="drop.status" />
            <CollectionDropCollectedBy
              v-if="ownerAddresses.length"
              :addresses="ownerAddresses"
              :max-address-count="3"
              size="small" />
          </div>
        </div>
      </component>
    </div>

    <DropsDropCardSkeleton v-else />
  </div>
</template>

<script setup lang="ts">
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import type { Metadata } from '@/components/rmrk/service/scheme'
import TimeTag from './TimeTag.vue'
import { Drop } from './useDrops'
import { resolveComponent } from 'vue'
import { Prefix } from '@kodadot1/static'
import { useCollectionActivity } from '@/composables/collectionActivity/useCollectionActivity'
import { getDropStatus } from '@/services/fxart'

const NuxtLink = resolveComponent('NuxtLink')

const isLoadingMeta = ref(false)

interface Props {
  drop: Drop
  dropUrl?: string
}

const props = defineProps<Props>()
const image = ref('')
const externalUrl = ref()

const dropPrefix = computed(() => props.drop.chain as Prefix)

const { owners } = useCollectionActivity({
  collectionId: computed(() => props.drop?.collection.collection),
})

const ownerAddresses = computed(() => Object.keys(owners.value || {}))

const mintedCount = ref(0)

onMounted(async () => {
  if (!props.drop?.collection) {
    return
  }

  getDropStatus(props.drop.collection.alias)
    .then((res) => (mintedCount.value = res.count))
    .catch((err) => console.error(err))

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
