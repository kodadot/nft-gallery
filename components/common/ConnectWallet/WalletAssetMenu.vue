<template>
  <div
    :class="{ 'border-t': filteredMenus.length }"
    class="wallet-asset-container flex flex-col"
    data-testid="sidebar-wallet-container"
  >
    <div>
      <a
        v-for="menu in filteredMenus"
        :key="menu.label"
        v-safe-href="menu.to"
        class="wallet-asset-menu"
      >
        <span>{{ menu.label }}</span>
        <Icon
          name="i-mdi:chevron-right"
          class="text-k-grey size-6"
        />
      </a>
    </div>
    <div class="wallet-asset-footer flex py-5 text-xs text-k-grey">
      <!-- light/dark mode -->
      <ColorModeSwitch />

      <!-- language -->
      <div
        data-testid="sidebar-language"
        class="language-selector"
      >
        <NeoDropdown
          position="top-left"
          aria-role="menu"
          mobile-modal
        >
          <template #trigger>
            <div class="flex items-center">
              <Icon
                name="i-mdi:earth"
                class="size-6"
              />
              <span class="is-hidden-mobile ml-1">
                {{ $t('profileMenu.language') }}
              </span>
            </div>
          </template>

          <NeoDropdownItem
            v-for="lang in langsFlags"
            :key="lang.value"
            aria-role="listitem"
            :data-testid="`sidebar-language-${lang.value}`"
            :value="lang.value"
            :class="{ 'is-active': $i18n.locale === lang.value }"
            @click="usePreferencesStore().setUserLocale(lang.value)"
          >
            <span>{{ lang.flag }} {{ lang.label }}</span>
          </NeoDropdownItem>
        </NeoDropdown>
      </div>

      <!-- settings -->
      <nuxt-link
        to="/settings"
        class="text-k-grey items-center"
        data-testid="sidebar-link-settings"
        @click="closeModal"
      >
        <Icon
          name="i-mdi:cog-outline"
          class="size-6"
        />
        <span class="is-hidden-mobile">{{ $t('settings') }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import type { Prefix } from '@kodadot1/static'
import { transferVisible, teleportVisible, swapVisible } from '@/utils/config/permission.config'

const { urlPrefix } = usePrefix()
const { neoModal } = useProgrammatic()
const { $i18n } = useNuxtApp()

const menus = ref<{ label: string, to: string, check: (v: Prefix) => boolean }[]>([
  {
    label: 'Transfer',
    to: `/${urlPrefix.value}/transfer`,
    check: transferVisible,
  },
  {
    label: 'Teleport Bridge',
    to: `/${urlPrefix.value}/teleport`,
    check: teleportVisible,
  },
  {
    label: $i18n.t('swap.createSwap'),
    to: `/${urlPrefix.value}/swap`,
    check: swapVisible,
  },
])

const filteredMenus = computed(() =>
  menus.value.filter(menu => menu.check(urlPrefix.value)),
)

const closeModal = () => {
  neoModal.closeAll()
}
</script>

<style lang="scss" scoped>
.wallet-asset-menu {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  @apply border-b border-k-grey;

  &:last-child {
    @apply border-b-0;
  }
}

.wallet-asset-footer {
  border-top: 1px solid grey;
  justify-content: space-between;

  @apply bulma-mobile:justify-center;

  .language-selector {
    @apply bulma-mobile:my-8 bulma-mobile:mx-0;
  }

  & > * {
    @apply cursor-pointer flex gap-1;

    &:hover {
      @apply text-text-color;
    }
  }

  /* manually center dropdown menu, because no props "position" to center it */
  :deep(.o-drop__menu) {
    @apply bulma-tablet:translate-x-[50px]
  }
}
</style>
