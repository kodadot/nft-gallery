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
const { $store } = useNuxtApp()
const { setUrlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const router = useRouter()

const changeChain = (value) => {
  setUrlPrefix(value)
  $store.dispatch('setUrlPrefix', value)
  router.push({ path: `/${value}` })
  preferencesStore.setNotificationBoxCollapse(false)
}
</script>
