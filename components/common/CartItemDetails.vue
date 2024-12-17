<template>
  <BaseCartItemDetails
    v-if="nft"
    :name="nft.name"
    :image="avatar"
    :second-name="nft.collection?.name || nft.collection.id"
    :discarded="discarded"
  >
    <template
      v-if="nft.mediaUrl"
      #image
    >
      <BaseMediaItem
        class="border border-k-shade image is-48x48"
        :class="{ 'opacity-50': discarded }"
        :alt="nft?.name"
        :src="sanitizeIpfsUrl(nft.mediaUrl.image)"
        :mime-type="nft.mediaUrl.mimeType"
        preview
        is-detail
      />
    </template>

    <template #right>
      <slot name="right" />
    </template>

    <template #footer>
      <slot name="footer" />
    </template>
  </BaseCartItemDetails>
</template>

<script setup lang="ts">
import { parseNftAvatar } from '@/utils/nft'
import type { ListCartItem } from '@/stores/listingCart'
import type { MakingOfferItem } from '@/components/trade/types'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const avatar = ref<string>('')

const props = defineProps<{
  nft?: (ListCartItem | MakingOfferItem) & {
    mediaUrl?: {
      image: string
      mimeType: string
    }
  }
  discarded?: boolean
}>()

const getAvatar = async () => {
  if (props.nft) {
    avatar.value = await parseNftAvatar(props.nft as EntityWithMeta)
  }
}

onMounted(() => {
  if (!props.nft?.mediaUrl) {
    getAvatar()
  }
})
</script>
