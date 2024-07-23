<template>
  <ConfirmPurchaseItemRow
    :image="avatar"
    :name="nft.name"
    :sn="nft.sn"
    :collection-name="nft.collection?.name || nft.collection.id"
    :price="nft.price"
  />
</template>

<script setup lang="ts">
import type { ShoppingCartItem } from '../shoppingCart/types'
import { parseNftAvatar } from '@/utils/nft'

const avatar = ref<string>()

const props = defineProps<{
  nft: ShoppingCartItem
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
