<template>
  <div v-if="!rememberIdentity" class="set-identity">
    <div
      class="wallet-asset-container is-size-7 py-1 is-flex is-justify-content-space-between">
      <a v-safe-href="'/identity'">Create Your Onchain Identity</a>
      <a @click="rememberIdentity = true">Close</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const emit = defineEmits(['close'])

const closeModal = () => {
  console.log('close')
  emit('close')
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
