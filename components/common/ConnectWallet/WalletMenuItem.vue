<template>
  <div class="wallet-menu-item">
    <button
      class="button my-0 !px-8 py-2.5 flex justify-between items-center"
      @click="onClickWallet(wallet)"
    >
      <span>
        <div class="flex justify-between items-center">
          <span class="flex items-center">
            <img
              :src="wallet.img"
              :alt="wallet.extensionName"
              width="32"
              style="vertical-align: middle"
            >
            <span class="text-base ml-2 capitalize">{{ wallet.name }}</span>

            <NeoTag
              v-if="isRecent(wallet)"
              class="capitalize ml-2"
              variant="transparent"
              size="small"
            >
              {{ $t('recent') }}
            </NeoTag>
          </span>

          <div
            v-if="!wallet.installed"
            class="text-xs capitalize text-neutral-7"
          >
            {{ $t('moreActions.download') }}
            <Icon name="i-mdi:download" />
          </div>

          <Icon
            v-else-if="showAccountList"
            name="i-mdi:chevron-down"
          />

          <Icon
            v-else
            name="i-mdi:chevron-right"
          />
        </div>
      </span>
    </button>
    <div
      v-if="isAuth && walletAccounts.length === 0"
      class="pl-5 pt-2 pb-2 flex items-center auth-tip"
    >
      <Icon
        name="i-mdi:loading"
        class="animate-spin"
      />
      <span class="text-k-grey text-xs pl-4">
        {{ $t('walletConnect.authTip') }}
      </span>
    </div>

    <div
      v-if="walletAccountsWithProfile.length && showAccountList"
      class="account-list"
    >
      <div
        v-for="option in walletAccountsWithProfile"
        :key="option.address"
        class="account-item"
      >
        <a
          class="pl-5 flex items-center justify-between"
          :value="option.address"
          @click="emitAccountChange(option)"
        >
          <div class="flex items-center">
            <Avatar
              :size="33"
              :value="option.address"
              class="mr-2 image-outline"
            />
            <div class="flex flex-col">
              <span class="text-k-grey text-xs account-name">{{
                option.name
              }}</span>
              <div class="account-address">
                {{ shortAddress(option.address, 6, -3) }}
              </div>
            </div>
          </div>
          <NeoSkeleton
            v-if="isProfilesLoading"
            class="!w-[73px] !h-[22px] mr-1 rounded-full overflow-hidden"
            width="100%"
            height="100%"
            no-margin
          />
          <div
            v-else-if="option.profile"
            class="flex items-center rounded-full bg-neutral-3 dark:bg-neutral-11 px-[6px] py-[3px] h-[22px] gap-[0.375rem] mr-1"
          >
            <ProfileAvatar
              :size="12.5"
              :address="option.address"
              :profile-image="option.profile?.image"
            />
            <span
              class="text-sm max-w-[80px] text-ellipsis whitespace-nowrap overflow-hidden"
            >{{ option.profile?.name }}</span>
          </div>
        </a>
      </div>
    </div>

    <div
      v-if="walletAccountsWithProfile.length === 0 && showAccountList"
      class="account-list"
    >
      <div class="account-item">
        <a
          href="#!"
          class="pl-5 block"
        >
          <span class="block mb-2 text-sm">
            <Icon
              name="i-mdi:information-slab-circle-outline"
              class="mr-2 text-k-grey"
            />No Polkadot Accounts Found</span>
          <span class="block text-k-grey text-xs">To Continue, Please Create or Import Accounts in {{ wallet.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
import { DEFAULT_VM_PREFIX } from '@kodadot1/static'
import { chainPropListOf } from '@/utils/config/chain.config'
import type { WalletAccount } from '@/utils/config/wallets'
import type { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import shouldUpdate from '@/utils/shouldUpdate'
import { formatAddress } from '@/utils/account'
import shortAddress from '@/utils/shortAddress'
import { useWalletStore } from '@/stores/wallet'
import Avatar from '@/components/shared/Avatar.vue'
import NeoTag from '@/components/shared/gallery/NeoTag.vue'
import { toSubstrateAddress } from '@/services/profile'

defineProps<{
  wallet: BaseDotsamaWallet
}>()

const { chainProperties } = useChain()
const { $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const hasWalletProviderExtension = ref(false)
const walletAccounts = ref<WalletAccount[]>([])
const showAccountList = ref(false)
const emit = defineEmits(['setWallet', 'setAccount'])
const walletStore = useWalletStore()
const isAuth = ref(false)

const isRecent = (wallet: BaseDotsamaWallet) =>
  walletStore.getRecentWallet === wallet.source

const emitAccountChange = (account): void => {
  emit('setAccount', account)
}

const ss58Format = computed(() => chainProperties.value?.ss58Format)

const walletAccountsWithProfile = computed(() => {
  return walletAccounts.value.map((account) => {
    return {
      ...account,
      profile: existingProfiles.value?.find(
        p => p.address === toSubstrateAddress(account.address),
      ),
    }
  })
})

watch(walletAccounts, (newValue) => {
  if (shouldUpdate(newValue, walletAccounts.value)) {
    walletAccounts.value = newValue
  }
})

const { data: existingProfiles, isLoading: isProfilesLoading } = useProfiles('account-profiles', computed(() => walletAccounts.value.map(a => a.address)))

const formatAccount = (account: WalletAccount): WalletAccount => {
  return {
    ...account,
    address: formatAddress(account.address, !isPrefixVmOf(urlPrefix.value, 'SUB') ? chainPropListOf(DEFAULT_VM_PREFIX['SUB']).ss58Format : ss58Format.value),
  }
}

const onClickWallet = (wallet: BaseDotsamaWallet): void => {
  if (wallet.installed) {
    setWallet(wallet)
    showAccountList.value = !showAccountList.value
  }
  else {
    window.open(wallet.walletUrl, '_blank')
  }
}

const setWallet = async (wallet: BaseDotsamaWallet) => {
  emit('setWallet', wallet)
  // web3 wallet connect logic here & show accountSelect, async or not?
  isAuth.value = true

  await wallet.enable()
  // init account
  try {
    const data = await wallet.getAccounts()
    walletAccounts.value = data ? data.map(formatAccount) : []
  }
  catch (e) {
    isAuth.value = false
    $consola.error('init account error', e)
  }

  // subscribe change
  wallet.subscribeAccounts((accounts) => {
    // list of supported accounts for this wallet to show in AccoutSelect
    if (accounts) {
      walletAccounts.value = accounts.map(formatAccount)
    }
    isAuth.value = false
  })
  hasWalletProviderExtension.value = true
  //
}
</script>
