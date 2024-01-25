<template>
  <div v-if="!rememberIdentity" class="bg-blue-accent-bg-color">
    <div class="wallet-asset-container text-xs py-1 flex justify-between">
      <nuxt-link to="/identity" @click="closeModal"
        >Create Your Onchain Identity</nuxt-link
      >
      <a @click="rememberIdentity = true">Close</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
const { neoModal } = useProgrammatic()

const closeModal = () => {
  neoModal.closeAll()
}

const rememberIdentity = useStorage('remember-identity', false)
</script>
