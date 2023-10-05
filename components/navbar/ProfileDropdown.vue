<template>
  <div class="is-flex is-align-items-center">
    <a
      v-if="account"
      class="navbar-item"
      role="button"
      aria-label="open profile menu"
      @click="toggleWalletConnectModal">
      <Avatar :value="account" class="navbar__avatar-icon" :size="27" />
    </a>
    <div v-else class="is-flex is-align-items-center">
      <NeoDropdown
        position="bottom-left"
        aria-role="menu"
        menu-class="mt-0"
        :triggers="['hover']">
        <template #trigger>
          <a class="navbar-item my-4" role="button">
            <img :src="profileIcon" alt="profile" />
          </a>
        </template>

        <NeoDropdownItem aria-role="menuitem">
          <div
            class="is-flex is-align-items-center"
            @click="toggleLanguageMenu">
            {{ $t('profileMenu.language') }}&nbsp;<NeoIcon icon="globe" />
          </div>
        </NeoDropdownItem>
        <NeoDropdownItem aria-role="menuitem">
          <ColorModeButton />
        </NeoDropdownItem>
      </NeoDropdown>

      <div v-if="!account">
        <ConnectWalletButton
          class="button-connect-wallet px-4"
          variant="k-accent"
          no-shadow
          @toggleConnectModal="toggleWalletConnectModal" />
      </div>
    </div>

    <NeoDropdown
      ref="languageDropdown"
      position="bottom-left"
      aria-role="menu"
      :toggle="toggleLanguageMenu">
      <NeoDropdownItem
        aria-role="listitem"
        class="is-active is-flex is-align-items-center language-heading is-size-6"
        @click="toggleLanguageMenu">
        <span>{{ $t('profileMenu.language') }} <NeoIcon icon="globe" /></span>
      </NeoDropdownItem>

      <NeoDropdownItem
        v-for="lang in langsFlags"
        :key="lang.value"
        aria-role="listitem"
        :value="lang.value"
        :class="{ 'is-active': $i18n.locale === lang.value }"
        @click="$i18n.locale = lang.value">
        <span>{{ lang.flag }} {{ lang.label }}</span>
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem, NeoIcon } from '@kodadot1/brick'
import Avatar from '@/components/shared/Avatar.vue'
import { useIdentityStore } from '@/stores/identity'
import { langsFlags as langsFlagsList } from '@/utils/config/i18n'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import ConnectWalletButton from '@/components/shared/ConnectWalletButton.vue'

const identityStore = useIdentityStore()
const { isDarkMode } = useTheme()
const { neoModal } = useProgrammatic()

const languageDropdown = ref(null)
const modal = ref<{ close: () => void; isActive?: boolean } | null>(null)

const account = computed(() => identityStore.getAuthAddress)
const profileIcon = computed(() =>
  isDarkMode.value ? '/profile-dark.svg' : '/profile.svg',
)
const langsFlags = computed(() => langsFlagsList)

const toggleWalletConnectModal = () => {
  neoModal.closeAll()

  if (!document.querySelector('.connect-wallet-modal')) {
    modal.value = neoModal.open({
      ...ConnectWalletModalConfig,
    })
  }
}

const toggleLanguageMenu = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  languageDropdown.value?.toggle()
}
</script>
