<template>
  <div class="is-flex is-align-items-center">
    <a
      v-if="account"
      class="navbar-item"
      role="button"
      @click="toggleWalletConnectModal">
      <Avatar :value="account" class="navbar__avatar-icon" :size="27" />
    </a>
    <div v-else class="is-flex is-align-items-center">
      <NeoDropdown
        position="is-bottom-left"
        aria-role="menu"
        :triggers="['hover']">
        <template #trigger>
          <a class="navbar-item" role="button">
            <img :src="profileIcon" />
          </a>
        </template>

        <NeoDropdownItem has-link aria-role="menuitem">
          <a class="is-flex is-align-items-center" @click="toggleLanguageMenu">
            {{ $t('profileMenu.language') }}&nbsp;<NeoIcon icon="globe" />
          </a>
        </NeoDropdownItem>
        <NeoDropdownItem has-link aria-role="menuitem">
          <ColorModeButton />
        </NeoDropdownItem>
      </NeoDropdown>

      <div v-if="!account">
        <ConnectWalletButton
          class="button-connect-wallet px-4"
          variant="k-accent"
          no-shadow
          :modal-toggle-disabled="true"
          @toggleConnectModal="toggleWalletConnectModal" />
      </div>
    </div>

    <NeoDropdown
      ref="languageDropdown"
      position="is-bottom-left"
      aria-role="menu"
      :toggle="toggleLanguageMenu">
      <NeoDropdownItem
        aria-role="listitem"
        class="is-active is-flex is-align-items-center language-heading is-size-6"
        @click="toggleLanguageMenu">
        {{ $t('profileMenu.language') }}
        <svg
          width="14"
          height="13"
          class="ml-2"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 6.5C1 9.8138 3.6862 12.5 7 12.5C10.3138 12.5 13 9.8138 13 6.5C13 3.1862 10.3138 0.5 7 0.5C3.6862 0.5 1 3.1862 1 6.5Z"
            fill="white"
            stroke="black"
            stroke-width="0.9"
            stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M7.59993 0.530273C7.59993 0.530273 9.39993 2.90027 9.39993 6.50027C9.39993 10.1003 7.59993 12.4703 7.59993 12.4703M6.39993 12.4703C6.39993 12.4703 4.59993 10.1003 4.59993 6.50027C4.59993 2.90027 6.39993 0.530273 6.39993 0.530273M1.37793 8.60027H12.6219M1.37793 4.40027H12.6219"
            stroke="black"
            stroke-width="0.9"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </NeoDropdownItem>

      <NeoDropdownItem
        v-for="lang in langsFlags"
        :key="lang.value"
        aria-role="listitem"
        has-link
        :value="lang.value"
        :class="{ 'is-active': userLang === lang.value }"
        @click="setUserLang(lang.value)">
        <a
          >{{ lang.flag }}
          {{ lang.label }}
        </a>
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem, NeoIcon } from '@kodadot1/brick'
import Avatar from '@/components/shared/Avatar.vue'
import { useIdentityStore } from '@/stores/identity'
import { useLangStore } from '@/stores/lang'
import { langsFlags as langsFlagsList } from '@/utils/config/i18n'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import type { BModalConfig } from 'buefy/types/components'

const { $buefy } = useNuxtApp()
const identityStore = useIdentityStore()
const langStore = useLangStore()
const instance = getCurrentInstance()
const { isDarkMode } = useTheme()

const languageDropdown = ref(null)
const modal = ref<{ close: () => void; isActive?: boolean } | null>(null)

const account = computed(() => identityStore.getAuthAddress)
const profileIcon = computed(() =>
  isDarkMode.value ? '/profile-dark.svg' : '/profile.svg'
)
const langsFlags = computed(() => langsFlagsList)
const userLang = computed(() => langStore.language.userLang)

const setUserLang = (value: string) => {
  langStore.setLanguage({ userLang: value })
}

const toggleWalletConnectModal = () => {
  if (modal.value?.isActive) {
    modal.value.close()
    modal.value = null
    return
  }

  modal.value = $buefy.modal.open({
    parent: instance?.proxy,
    ...ConnectWalletModalConfig,
  } as unknown as BModalConfig)
}

const toggleLanguageMenu = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  languageDropdown.value?.toggle()
}
</script>
