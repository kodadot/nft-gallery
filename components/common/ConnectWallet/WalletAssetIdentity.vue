<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <IdentityItem
      :account="account"
      :label="display || shortenedAddress"
      :prefix="urlPrefix"
      variant="button" />
    <div class="is-flex is-flex-direction-column">
      <a v-clipboard:copy="account" @click="toast('Copied to clipboard')">
        <NeoIcon icon="copy" />
      </a>
      <hr class="my-1" />
      <a @click="logout()">
        <NeoIcon icon="right-from-bracket" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IdentityItem, NeoIcon } from '@kodadot1/brick'
import { useIdentityStore } from '@/stores/identity'
import useIdentity from '@/components/identity/utils/useIdentity'

const identityStore = useIdentityStore()
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { display, shortenedAddress } = useIdentity({
  address: identityStore.getAuthAddress,
})

const account = computed(() => identityStore.getAuthAddress)

const logout = () => {
  identityStore.resetAuth()
  sessionStorage.clear()
  localStorage.clear()
}
</script>
