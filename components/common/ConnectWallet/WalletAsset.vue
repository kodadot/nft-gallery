<template>
  <div class="is-flex is-flex-direction-column wallet-asset">
    <div>
      <div class="is-capitalized">
        {{ $i18n.t('walletConnect.walletAccount', [extensionName]) }}
      </div>
      <Identity
        class="identity-address is-size-6"
        :address="account"
        show-clipboard
        hide-identity-popover />
    </div>

    <hr class="dropdown-divider" />

    <div>
      <ProfileAssetsList v-if="isSnekOrBsx" @totalValueChange="setTotalValue" />
      <AccountBalance v-else class="is-size-7" />
    </div>

    <hr class="dropdown-divider" />

    <div
      v-if="totalValue"
      class="is-flex is-justify-content-space-between is-align-items-center my-1">
      <span class="is-size-7"> {{ $i18n.t('walletConnect.total') }}: </span>
      <span> ${{ totalValue }} </span>
    </div>
    <div
      class="buttons is-justify-content-space-between is-flex-wrap-nowrap my-2">
      <NeoButton
        class="button is-size-7 is-capitalized"
        :label="$i18n.t('general.change_account')"
        variant="connect-dropdown"
        @click.native="backToWallet" />
      <NeoButton
        class="button is-size-7 is-capitalized"
        :label="$i18n.t('profileMenu.disconnect')"
        variant="connect-dropdown"
        @click.native="disconnect()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

import { clearSession } from '@/utils/cachingStrategy'
import { getKusamaAssetId } from '~~/utils/api/bsx/query'
const ConnectWalletButton = defineAsyncComponent(
  () => import('@/components/shared/ConnectWalletButton.vue')
)
const Identity = defineAsyncComponent(
  () => import('@/components/identity/IdentityIndex.vue')
)
const AccountBalance = defineAsyncComponent(
  () => import('@/components/shared/AccountBalance.vue')
)
const SimpleAccountBalance = defineAsyncComponent(
  () => import('@/components/shared/SimpleAccountBalance.vue')
)
const ProfileAssetsList = defineAsyncComponent(
  () => import('@/components/rmrk/Profile/ProfileAssetsList.vue')
)
const extensionName = computed(() => localStorage.getItem('wallet'))
const totalValue = ref(0)

const emit = defineEmits(['back'])

const { urlPrefix } = usePrefix()

const { $store, $i18n } = useNuxtApp()
const account = ref($store.getters.getAuthAddress)

watch(account, (val) => {
  $store.dispatch('setAuth', { address: val })
})

const disconnect = () => {
  $store.dispatch('setAuth', { address: '' }) // null not working
  clearSession()
}

const backToWallet = () => {
  emit('back')
}

const tokens = computed(() => ['', getKusamaAssetId(urlPrefix.value)])

const isSnekOrBsx = computed(
  () => urlPrefix.value === 'snek' || urlPrefix.value === 'bsx'
)
const setTotalValue = (value: number) => {
  totalValue.value = value
}
</script>
