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
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { useIdentityStore } from '@/stores/identity'

const identityStore = useIdentityStore()
const { urlPrefix } = usePrefix()
const { toast } = useToast()

const account = computed(() => identityStore.getAuthAddress)

const { display, shortenedAddress } = useIdentity({
  address: account,
})
</script>
