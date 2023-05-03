<template>
  <div class="is-flex is-flex-direction-column wallet-asset">
    <div>
      <div>
        {{ walletName }}
      </div>
      <Identity
        class="identity-address is-size-6"
        :shortened-address="shortenedAddress"
        :address="account"
        show-clipboard />
    </div>

    <hr class="my-2" />

    <div>
      <ProfileAssetsList v-if="isSnekOrBsx" @totalValueChange="setTotalValue" />
      <AccountBalance v-else class="is-size-7" />
    </div>

    <hr class="my-2" />

    <div
      v-if="totalValue"
      class="is-flex is-justify-content-space-between is-align-items-center my-1">
      <span class="is-size-7"> {{ $i18n.t('spotlight.total') }}: </span>
      <span> ${{ totalValue.toFixed(2) }} </span>
    </div>
    <div
      class="buttons is-justify-content-space-between is-flex-wrap-nowrap my-2">
      <NeoButton
        class="button is-size-7 is-capitalized is-flex-grow-1"
        :label="$i18n.t('general.change_account')"
        variant="connect-dropdown"
        @click.native="backToWallet" />
      <NeoButton
        class="button is-size-7 is-capitalized is-flex-grow-1"
        :label="$i18n.t('profileMenu.disconnect')"
        variant="connect-dropdown"
        @click.native="disconnect()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { useWalletStore } from '@/stores/wallet'
import { useIdentityStore } from '@/stores/identity'
import { clearSession } from '@/utils/cachingStrategy'
import useIdentity from '@/components/identity/utils/useIdentity'

const Identity = defineAsyncComponent(
  () => import('@/components/identity/module/IdentityLink.vue')
)
const AccountBalance = defineAsyncComponent(
  () => import('@/components/shared/AccountBalance.vue')
)
const ProfileAssetsList = defineAsyncComponent(
  () => import('@/components/rmrk/Profile/ProfileAssetsList.vue')
)
const totalValue = ref(0)
const walletStore = useWalletStore()
const identityStore = useIdentityStore()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()

const emit = defineEmits(['back'])

const account = computed(() => identityStore.getAuthAddress)
const walletName = computed(() => walletStore.wallet.name)
const isSnekOrBsx = computed(
  () => urlPrefix.value === 'snek' || urlPrefix.value === 'bsx'
)

const { shortenedAddress } = useIdentity({
  address: account,
  customNameOption: '',
})

const disconnect = () => {
  identityStore.resetAuth()
  clearSession()
}

const backToWallet = () => {
  emit('back')
}

const setTotalValue = (value: number) => {
  totalValue.value = value
}

onMounted(() => {
  if (identityStore.getAuthAddress) {
    console.log('fetching balance...')
    identityStore.fetchBalance({
      address: identityStore.getAuthAddress,
    })
    console.log(identityStore.auth.balance[urlPrefix.value])
  }
})

watch(urlPrefix, () => {
  setTotalValue(0)
})
</script>
