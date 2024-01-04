<template>
  <ConfirmPurchaseItemRow
    :image="avatar"
    :name="nft.name"
    :collection-name="nft.collection?.name || nft.collection.id"
    :price="nft.price" />
</template>

<script setup lang="ts">
import { parseNftAvatar } from '@/utils/nft'
import { ShoppingCartItem } from '../shoppingCart/types'

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
