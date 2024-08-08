<template>
  <div class="flex !px-7 !py-4">
    <NeoButton
      v-for="tab in walletTabs"
      :key="tab.value"
      class="w-full"
      no-shadow
      :active="tab.value === selectedTab"
      @click="selectedTab = tab.value"
    >
      {{ tab.label }}
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import type { ChainVM } from '@kodadot1/static'
import { NeoButton } from '@kodadot1/brick'

const props = defineProps<{ modelValue: ChainVM, preselected?: ChainVM }>()

const selectedTab = useVModel(props, 'modelValue')

const walletTabs = computed<{ label: string, value: ChainVM }[]>(() => {
  return [
    {
      label: 'Polkadot',
      value: 'SUB',
    },
    {
      label: 'Evm',
      value: 'EVM',
    },
  ].filter(tab => props.preselected ? tab.value === props.preselected : true)
})
</script>
