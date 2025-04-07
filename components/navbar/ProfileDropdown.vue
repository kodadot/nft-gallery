<template>
  <div class="flex items-center">
    <div
      v-if="account"
      class="navbar-item"
    >
      <NavbarConnectedProfile
        :address="account"
        @click="toggleWalletConnectModal"
      />
    </div>
    <div
      v-else
      class="flex items-center"
    >
      <NeoDropdown
        position="bottom-left"
        aria-role="menu"
        menu-class="mt-0"
        :triggers="['hover']"
      >
        <template #trigger>
          <a
            class="navbar-item"
            role="button"
          >
            <KIcon
              name="i-mdi:account-circle-outline"
              class="size-6"
            />
          </a>
        </template>

        <NeoDropdownItem aria-role="menuitem">
          <ColorModeButton />
        </NeoDropdownItem>
        <NeoDropdownItem aria-role="menuitem">
          <NavbarCookiesButton />
        </NeoDropdownItem>
      </NeoDropdown>

      <div v-if="!account">
        <ConnectWalletButton
          class="button-connect-wallet px-4"
          variant="primary"
          no-shadow
          @toggle-connect-modal="toggleWalletConnectModal"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'

import { useIdentityStore } from '@/stores/identity'
import { useProfileOnboardingStore } from '@/stores/profileOnboarding'

import { openConnectWalletModal } from '@/components/common/ConnectWallet/useConnectWallet'
import ConnectWalletButton from '@/components/shared/ConnectWalletButton.vue'

const identityStore = useIdentityStore()
const { neoModal } = useProgrammatic()

const account = computed(() => identityStore.getAuthAddress)

const toggleWalletConnectModal = () => {
  useProfileOnboardingStore().setSidebarToggled()
  neoModal.closeAll()

  if (!document.querySelector('.connect-wallet-modal')) {
    openConnectWalletModal()
  }
}
</script>
