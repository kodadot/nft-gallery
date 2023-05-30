<template>
  <div>
    <span
      v-for="chain in availableChains"
      :key="chain.value"
      class="navbar-item"
      @click="changeChain(chain.value)">
      <p class="menu-item mr-2">
        {{ chain.text }}
      </p>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { usePreferencesStore } from '@/stores/preferences'

const { availableChains } = useChain()
const { setUrlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()

const changeChain = (value) => {
  preferencesStore.setNotificationBoxCollapse(false)
  setUrlPrefix(value)
  navigateTo(`/${value}`)
}
</script>
