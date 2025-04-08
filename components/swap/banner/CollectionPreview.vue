<template>
  <div
    class="rounded-full min-w-[236px] h-[62px] md:w-auto border border-k-shade inline-flex justify-start px-2.5"
    data-testid="drop-created-by-container"
  >
    <div class="flex items-center">
      <div
        class="rounded-full overflow-hidden bg-background-color border"
        :style="{
          width: `${imageSize}px`,
          height: `${imageSize}px`,
          padding: `${Math.round(imageSize / 16)}px`,
        }"
      >
        <BaseMediaItem
          :src="sanitizeIpfsUrl(collection.meta?.image)"
          :image-component="NuxtImg"
          :sizes="`${imageSize}px`"
          title="User Avatar"
          class="object-cover overflow-hidden rounded-full h-full w-full shadow-none!"
          inner-class="object-cover"
        />
      </div>
      <div class="ml-3.5">
        <NuxtLink :to="`/${urlPrefix}/collection/${collectionId}`">
          {{ collection.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const NuxtImg = resolveComponent('NuxtImg')

const props = withDefaults(
  defineProps<{
    collectionId: string
    imageSize?: number
  }>(),
  {
    imageSize: 48,
  },
)

const { urlPrefix } = usePrefix()
const { collection } = useCollectionMinimal({
  collectionId: computed(() => props.collectionId),
})
</script>
