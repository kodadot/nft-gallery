<template>
  <div>
    <div class="flex justify-between">
      <div class="flex">
        <div>
          <BaseMediaItem
            v-if="nft.mediaUrl"
            class="border border-k-shade image is-48x48"
            :class="{ 'opacity-50': discarded }"
            :alt="nft?.name"
            :src="sanitizeIpfsUrl(nft.mediaUrl.image)"
            :mime-type="nft.mediaUrl.mimeType"
            preview
            is-detail />
          <!-- keeping BasicImage since its has a skeleton laoder -->
          <BasicImage
            v-else
            :src="avatar"
            :alt="nft?.name"
            class="border image is-48x48"
            :class="{ 'opacity-50': discarded }" />
        </div>

        <div class="flex flex-col justify-between ml-4 limit-width">
          <div
            class="font-bold line-height-1 whitespace-nowrap is-clipped is-ellipsis"
            :class="[discarded ? 'text-k-grey' : 'text-text-color']">
            {{ nameWithIndex(nft.name, nft.sn) }}
          </div>
          <div
            class="line-height-1 whitespace-nowrap is-clipped is-ellipsis"
            :class="{ 'text-k-grey': discarded }">
            {{ nft.collection?.name || nft.collection.id }}
          </div>
        </div>
      </div>

      <slot name="right" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { parseNftAvatar } from '@/utils/nft'
import { ListCartItem } from '@/stores/listingCart'
import BasicImage from '@/components/shared/view/BasicImage.vue'

const avatar = ref<string>()

const props = defineProps<{
  nft: ListCartItem
  discarded?: boolean
}>()

const getAvatar = async () => {
  if (props.nft) {
    avatar.value = await parseNftAvatar(props.nft)
  }
}

onMounted(() => {
  if (!props.nft.mediaUrl) {
    getAvatar()
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.limit-width {
  width: 170px;
  @include mobile {
    width: 100px;
  }
}

.line-height-1 {
  line-height: 1;
}
</style>
