<template>
  <div>
    <NeoDropdown position="bottom-right" @active-change="isActive = $event">
      <NeoButton
        :label="`Network: ${selected.text}`"
        :icon="isActive ? 'chevron-up' : 'chevron-down'" />

      <template #items>
        <NeoDropdownItem
          v-for="chain in availableChains"
          :key="chain.value"
          :active="route.params.prefix === chain.value"
          @click.native="onSwitchChain(chain.value)">
          {{ chain.text }}
        </NeoDropdownItem>
      </template>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'

const route = useRoute()
const router = useRouter()
const { $store } = useNuxtApp()

const { availableChains } = useChain()
const isActive = ref(false)
const selected = computed(() =>
  availableChains.value.find((chain) => chain.value === route.params.prefix)
)

function onSwitchChain(chain) {
  $store.dispatch('setUrlPrefix', chain)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page, ...restQuery } = route.query
  router.push({
    params: {
      prefix: chain,
    },
    query: {
      ...restQuery,
      collections: null,
    },
  })
}
</script>

<style scoped></style>
