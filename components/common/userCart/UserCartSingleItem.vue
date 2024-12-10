<template>
  <CartItemDetails :nft="item">
    <template #right>
      <div class="flex items-end">
        {{ nftPrice }}
      </div>
    </template>
  </CartItemDetails>
</template>

<script lang="ts" setup>
const props = defineProps<{
  item: ListCartItem
}>()

const { decimals, chainSymbol } = useChain()
const { formatted } = useAmount(computed(() => props.item.price), decimals, chainSymbol)
const nftPrice = computed(() => Number(props.item.price) ? formatted.value : '--')
</script>
