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
          class="group-hover:opacity-[0.85] h-[174px] object-cover w-full" />

        <div
          class="py-5 px-5 flex flex-col justify-between gap-4 border-t border-card-border-color group-hover:border-border-color">
          <span
            class="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-xl"
            >{{ drop.collection.name }}</span
          >

          <div
            class="flex item-start sm:items-center flex-col sm:flex-row justify-between flex-wrap gap-y-4 gap-x-2">
            <div class="flex justify-between items-center min-h-[34px]">
              <TimeTag
                v-if="drop.dropStartTime || ended"
                :drop-start-time="drop.dropStartTime"
                :drop-status="drop.status" />
            </div>

            <div class="flex gap-2">
              <span class="text-k-grey">{{ $t('price') }}</span>
              <span v-if="isFreeDrop">{{ $t('free') }}</span>
              <Money v-else :value="drop.price" :prefix="dropPrefix" inline />
            </div>
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
import { Drop, DropStatus } from './useDrops'
import { resolveComponent } from 'vue'
import { Prefix } from '@kodadot1/static'

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
const isFreeDrop = computed(() => !Number(props.drop.price))
const ended = computed(() => props.drop.status === DropStatus.MINTING_ENDED)

onMounted(async () => {
  if (!props.drop?.collection) {
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
