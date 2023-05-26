<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <IdentityItem
      :account="account"
      :label="display || shortenedAddress"
      :prefix="urlPrefix"
      variant="button" />
    <div class="is-flex is-flex-direction-column">
      <a v-clipboard:copy="account" @click="toast()">
        <i class="fa-sharp fa-light fa-copy"></i>
      </a>
      <hr class="my-1" />
      <a @click="logout()">
        <i class="fa-sharp fa-light fa-right-from-bracket"></i>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IdentityItem } from '@kodadot1/brick'
import { useIdentityStore } from '@/stores/identity'
import useIdentity from '@/components/identity/utils/useIdentity'

const identityStore = useIdentityStore()
const { urlPrefix } = usePrefix()
const { $buefy } = useNuxtApp()
const { display, shortenedAddress } = useIdentity({
  address: identityStore.getAuthAddress,
})

const account = computed(() => identityStore.getAuthAddress)
const toast = () => {
  $buefy.toast.open({
    message: 'Copied to clipboard',
    type: 'is-neo',
  })
}

const logout = () => {
  identityStore.resetAuth()
  sessionStorage.clear()
  localStorage.clear()
}
</script>
