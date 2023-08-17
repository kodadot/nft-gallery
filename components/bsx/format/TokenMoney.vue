<template>
  <BasicMoney
    :value="value"
    :unit="unit"
    :decimals="decimals"
    :inline="inline"
    :hide-unit="hideUnit"
    :round="round" />
</template>

<script lang="ts" setup>
import BasicMoney from '@/components/shared/format/BasicMoney.vue'
import { useAssetsStore } from '@/stores/assets'

const assetsStore = useAssetsStore()
const assetIdOf = (id: string | number) => assetsStore.getAssetById(String(id))
const props = withDefaults(
  defineProps<{
    value: number | string | undefined
    tokenId: string
    inline: boolean
    hideUnit?: boolean
    round?: number
  }>(),
  {
    value: '0',
    tokenId: '5',
    round: 4,
  }
)

const asset = computed(() => assetIdOf(props.tokenId))
const unit = computed(() => asset.symbol)
const decimals = computed(() => asset.decimals)
</script>
