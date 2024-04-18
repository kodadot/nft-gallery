<template>
  <div
    class="rounded-full h-[62px] md:w-auto border border-k-shade inline-flex items-center justify-between px-3"
    :class="{ 'h-full border-none': size === 'small' }"
    data-testid="drop-collected-by-container">
    <div class="flex items-center">
      <CollectionDropCollectedByAvatar
        v-for="(address, index) in addresses.slice(0, maxAddressCount)"
        :key="address"
        :class="[zIndexMap[index], { '-ml-2': index > 0 }]"
        :address="address"
        :size="size"
        data-testid="collector-avatar" />
    </div>

    <div v-if="remainingCount" class="ml-2.5">+{{ remainingCount }}</div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    addresses: string[]
    maxAddressCount?: number
    size?: 'small' | 'medium'
  }>(),
  {
    size: 'medium',
    maxAddressCount: 5,
  },
)

const zIndexMap = ['z-50', 'z-40', 'z-30', 'z-20', 'z-10']

const remainingCount = computed(() =>
  props.addresses.length > props.maxAddressCount
    ? props.addresses.length - props.maxAddressCount
    : 0,
)
</script>
