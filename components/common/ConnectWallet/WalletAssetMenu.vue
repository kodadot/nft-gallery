<template>
  <div
    class="wallet-asset-container mt-4 is-flex is-flex-direction-column is-justify-content-space-between">
    <div>
      <a
        v-for="menu in menus"
        :key="menu.label"
        v-safe-href="menu.to"
        class="wallet-asset-menu">
        <span>{{ menu.label }}</span>
        <NeoIcon icon="angle-right" size="medium" class="has-text-grey" />
      </a>
    </div>
    <div
      class="wallet-asset-footer is-flex is-justify-content-space-between py-5 is-size-7 has-text-grey">
      <!-- light/dark mode -->
      <div class="is-align-items-center" @click="toggleColorMode">
        <NeoIcon icon="circle-half-stroke" custom-size="fa-2x" />
        <span v-if="isDarkMode">{{ $t('profileMenu.lightMode') }}</span>
        <span v-else>{{ $t('profileMenu.darkMode') }}</span>
      </div>

      <!-- language -->
      <div data-testid="sidebar-language">
        <NeoDropdown position="top-left" aria-role="menu" mobile-modal>
          <template #trigger>
            <div class="is-flex is-align-items-center">
              <NeoIcon icon="globe" custom-size="fa-2x" class="mr-1" />
              <span>{{ $t('profileMenu.language') }}</span>
            </div>
          </template>

          <NeoDropdownItem
            v-for="lang in langsFlags"
            :key="lang.value"
            aria-role="listitem"
            :data-testid="`sidebar-language-${lang.value}`"
            :value="lang.value"
            :class="{ 'is-active': langStore.getUserLang === lang.value }"
            @click="langStore.setLanguage({ userLang: lang.value })">
            <span>{{ lang.flag }} {{ lang.label }}</span>
          </NeoDropdownItem>
        </NeoDropdown>
      </div>

      <!-- settings -->
      <nuxt-link
        to="/settings"
        class="has-text-grey is-align-items-center"
        @click.native="closeModal">
        <NeoIcon icon="gear" custom-size="fa-2x" />
        <span>{{ $t('settings') }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoDropdown, NeoDropdownItem, NeoIcon } from '@kodadot1/brick'
import { langsFlags } from '@/utils/config/i18n'
import { useLangStore } from '@/stores/lang'

const { urlPrefix } = usePrefix()
const { isBasilisk } = useIsChain(urlPrefix)
const { toggleColorMode, isDarkMode } = useTheme()
const { $neoModal } = useNuxtApp()

const langStore = useLangStore()

const menus = ref([
  {
    label: 'Transfer',
    to: `/${urlPrefix.value}/transfer`,
  },
  {
    label: 'Teleport Bridge',
    to: `/${urlPrefix.value}/teleport`,
  },
  {
    label: 'Onchain Identity',
    to: '/identity',
  },
])

onMounted(() => {
  if (isBasilisk.value) {
    menus.value.push({
      label: 'Incoming Offers',
      to: `/${urlPrefix.value}/incomingoffers`,
    })

    menus.value.push({
      label: 'Assets',
      to: `/${urlPrefix.value}/assets`,
    })
  }
})

const closeModal = () => {
  $neoModal.closeAll()
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.wallet-asset-container {
  @include ktheme() {
    border-top: 1px solid theme('border-color');
  }
  height: 100%;
}

.wallet-asset-menu {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid grey;

  &:last-child {
    border-bottom: 0;
  }
}

.wallet-asset-footer {
  border-top: 1px solid grey;

  & > * {
    cursor: pointer;
    display: flex;
    gap: 0.25rem;

    &:hover {
      @include ktheme() {
        color: theme('text-color');
      }
    }
  }

  @include tablet {
    // manually center dropdown menu, because no props "postition" to center it
    :deep(.o-drop__menu) {
      transform: translateX(50px);
    }
  }
}
</style>
