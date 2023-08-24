<template>
  <div v-if="!rememberIdentity" class="set-identity">
    <div
      class="wallet-asset-container is-size-7 py-1 is-flex is-justify-content-space-between">
      <nuxt-link to="/identity" @click.native="closeModal"
        >Create Your Onchain Identity</nuxt-link
      >
      <a @click="rememberIdentity = true">Close</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
const { $neoModal } = useNuxtApp()

const closeModal = () => {
  $neoModal.closeAll()
}

const rememberIdentity = useStorage('remember-identity', false)
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.set-identity {
  @include ktheme() {
    background-color: theme('blue-accent-bg-color');
  }
}
</style>
