<template>
  <div>
    <NeoDropdown position="bottom-right" @active-change="isActive = $event">
      <NeoButton
        label="All Networks"
        :icon="isActive ? 'caret-up' : 'caret-down'" />

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

function onSwitchChain(chain) {
  $store.dispatch('setUrlPrefix', chain)

  router.push({
    params: {
      prefix: chain,
    },
    query: {
      page: '1',
      sort: route.query.sort,
    },
  })
}
</script>

<style scoped></style>
