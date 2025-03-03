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
            class="navbar-item my-4"
            role="button"
          >
            <Icon
              name="i-mdi:account-circle-outline"
              class="text-xl"
            />
          </a>
        </template>

        <NeoDropdownItem aria-role="menuitem">
          <div
            class="flex items-center"
            @click="toggleLanguageMenu"
          >
            {{ $t('profileMenu.language') }}&nbsp;<Icon name="i-mdi:earth" />
          </div>
        </NeoDropdownItem>
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

    <NeoDropdown
      ref="languageDropdown"
      position="bottom-left"
      aria-role="menu"
      :toggle="toggleLanguageMenu"
    >
      <NeoDropdownItem
        aria-role="listitem"
        class="is-active flex items-center language-heading text-base"
        @click="toggleLanguageMenu"
      >
        <span>{{ $t('profileMenu.language') }} <Icon name="i-mdi:earth" /></span>
      </NeoDropdownItem>

      <NeoDropdownItem
        v-for="lang in langsFlags"
        :key="lang.value"
        aria-role="listitem"
        :value="lang.value"
        :class="{ 'is-active': $i18n.locale === lang.value }"
        @click="usePreferencesStore().setUserLocale(lang.value)"
      >
        <span>{{ lang.flag }} {{ lang.label }}</span>
      </NeoDropdownItem>
    </NeoDropdown>
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

const languageDropdown = ref(null)

const account = computed(() => identityStore.getAuthAddress)

const toggleWalletConnectModal = () => {
  useProfileOnboardingStore().setSidebarToggled()
  neoModal.closeAll()

  if (!document.querySelector('.connect-wallet-modal')) {
    openConnectWalletModal()
  }
}

const toggleLanguageMenu = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  languageDropdown.value?.toggle()
}
</script>
