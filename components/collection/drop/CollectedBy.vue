<template>
  <div
    class="rounded-full min-w-[226px] h-[62px] md:w-auto border border-k-shade inline-flex items-center justify-between px-3">
    <div class="flex items-center">
      <CollectionDropCollectedByAvatar
        v-for="(address, index) in addresses.slice(0, maxAddressCount)"
        :key="address"
        :class="[zIndexMap[index], { '-ml-2': index > 0 }]"
        :address="address" />
    </div>

    <div v-if="remainingCount">+{{ remainingCount }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  addresses: string[]
}>()

const maxAddressCount = 5
const zIndexMap = ['z-50', 'z-40', 'z-30', 'z-20', 'z-10']

const remainingCount = computed(() =>
  props.addresses.length > maxAddressCount
    ? props.addresses.length - maxAddressCount
    : 0,
)
</script>
