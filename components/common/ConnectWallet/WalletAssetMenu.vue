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
        <KIcon
          name="i-mdi:chevron-right"
          size="medium"
          class="text-k-grey"
        />
      </a>
    </div>
    <div class="wallet-asset-footer flex py-5 text-xs text-k-grey">
      <!-- light/dark mode -->
      <ColorModeSwitch />
      <!-- settings -->
      <nuxt-link
        to="/settings"
        class="text-k-grey items-center"
        data-testid="sidebar-link-settings"
        @click="closeModal"
      >
        <KIcon
          name="i-mdi:cog-outline"
          size="medium"
        />
        <span class="is-hidden-mobile">{{ $t('settings') }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
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
