<template>
  <div
    class="wallet-asset-container mt-4 is-flex is-flex-direction-column is-justify-content-space-between">
    <div>
      <a
        v-for="menu in menus"
        :key="menu.label"
        :href="menu.to"
        class="wallet-asset-menu">
        <span>{{ menu.label }}</span>
        <NeoIcon icon="angle-right" class="has-text-grey" />
      </a>
    </div>
    <div
      class="wallet-asset-footer is-flex is-justify-content-space-between py-4 is-size-7 has-text-grey">
      <div @click="toggleColorMode">
        <NeoIcon icon="circle-half-stroke" />
        <span v-if="isDarkMode">{{ $t('profileMenu.lightMode') }}</span>
        <span v-else>{{ $t('profileMenu.darkMode') }}</span>
      </div>
      <div @click="toggleLanguageMenu">
        <NeoIcon icon="globe" />
        <span>{{ $t('profileMenu.language') }}</span>
        <b-dropdown
          ref="languageDropdown"
          position="is-top-left"
          aria-role="menu"
          mobile-modal
          :toggle="toggleLanguageMenu">
          <b-dropdown-item
            v-for="lang in langsFlags"
            :key="lang.value"
            aria-role="listitem"
            has-link
            :value="lang.value"
            :class="{ 'is-active': langStore.getUserLang === lang.value }"
            @click="langStore.setLanguage({ userLang: lang.value })">
            <a>{{ lang.flag }} {{ lang.label }}</a>
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <a href="/settings" class="has-text-grey">
        <NeoIcon icon="gear" />
        <span>{{ $t('settings') }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { langsFlags } from '@/utils/config/i18n'
import { useLangStore } from '@/stores/lang'

const { urlPrefix } = usePrefix()
const { isBasilisk } = useIsChain(urlPrefix)
const { toggleColorMode, isDarkMode } = useTheme()

const langStore = useLangStore()

const menus = ref([
  {
    label: 'Transfer',
    to: `/${urlPrefix.value}/transfer`,
  },
  {
    label: 'Teleport Bridge',
    to: '/teleport-bridge',
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

const languageDropdown = ref(null)
const toggleLanguageMenu = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  languageDropdown.value?.toggle()
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

  :deep .dropdown-content {
    padding-top: 0;

    @include ktheme() {
      .has-link a {
        color: theme('text-color');

        &:hover {
          background-color: theme('k-accentlight');
        }
      }

      .is-active {
        background-color: theme('text-color');

        a {
          color: theme('text-color-inverse');

          &:hover {
            background-color: theme('text-color');
          }
        }
      }
    }
  }

  @include tablet {
    // manually center dropdown menu, because no props "postition" to center it
    :deep .dropdown-menu {
      transform: translateX(50px);
      bottom: 150%;
    }
  }
}
</style>
