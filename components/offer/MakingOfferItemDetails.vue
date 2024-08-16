<template>
  <div>
    <div class="flex justify-between">
      <div class="flex">
        <div>
          <BasicImage
            :src="avatar"
            :alt="nft?.name"
            class="border image is-48x48"
            :class="{ 'opacity-50': discarded }"
          />
        </div>

        <div class="flex flex-col justify-between ml-4 limit-width">
          <div
            class="font-bold line-height-1 whitespace-nowrap is-clipped is-ellipsis"
            :class="[discarded ? 'text-k-grey' : 'text-text-color']"
          >
            {{ nameWithIndex(nft.name, nft.sn) }}
          </div>
          <div
            class="line-height-1 whitespace-nowrap is-clipped is-ellipsis"
            :class="{ 'text-k-grey': discarded }"
          >
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
import type { ListCartItem } from '@/stores/listingCart'
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
  getAvatar()
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
