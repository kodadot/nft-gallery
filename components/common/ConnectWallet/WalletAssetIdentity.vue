<template>
  <div class="flex items-center justify-between">
    <NuxtLink
      :to="`/${urlPrefix}/u/${account}`"
      class="w-full"
      data-testid="view-profile-button"
      @click="closeModal">
      <IdentityItem
        :account="account"
        :label="display || shortenedAddress"
        :prefix="urlPrefix">
        <template #default="{ label }">
          <div class="pl-3">
            <div class="font-bold mb-1 truncate max-w-[11rem]">
              {{ profile?.name ? profile?.name : label }}
            </div>

            <div class="text-xs text-k-grey">
              {{ $t('viewProfile') }}
            </div>
          </div>
        </template>
      </IdentityItem>
    </NuxtLink>

    <div class="flex flex-row gap-2 pl-2">
      <a
        v-clipboard:copy="account"
        @click="toast($t('general.copyAddressToClipboard'))">
        <NeoIcon icon="copy" />
      </a>
      <a @click="logout">
        <NeoIcon icon="right-from-bracket" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { useIdentityStore } from '@/stores/identity'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { useWalletStore, walletHistory } from '@/stores/wallet'

const identityStore = useIdentityStore()
const shoppingCartStore = useShoppingCartStore()
const walletStore = useWalletStore()
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { neoModal } = useProgrammatic()

const account = computed(() => identityStore.getAuthAddress)

const { profile } = useFetchProfile(account.value)

const { display, shortenedAddress } = useIdentity({
  address: account,
})

const closeModal = () => neoModal.closeAll()

const logout = () => {
  identityStore.resetAuth()
  sessionStorage.clear()
  localStorage.clear()
  shoppingCartStore.clear()

  walletHistory.value = walletStore.history
}
</script>
