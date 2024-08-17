import { balanceOf } from '@kodadot1/sub-api'
import type { Address } from 'viem'
import { getBalance as accountBalance } from '@wagmi/core'
import type { Prefix } from '@kodadot1/static'
import { useIdentityStore } from '@/stores/identity'

export default function () {
  const { urlPrefix } = usePrefix()
  const identityStore = useIdentityStore()

  const getBalance = (_token: string) => {
    switch (urlPrefix.value) {
      default:
        return identityStore.getAuthBalance
    }
  }

  const balance = computed(() => getBalance('KSM'))

  const getSubBalance = async (address: string) => {
    const { apiInstance } = useApi()
    try {
      const api = await apiInstance.value
      return await balanceOf(api, address)
    }
    catch (e) {
      return null
    }
  }

  const getEvmBalance = async (address: string, prefix: Prefix) => {
    if (!address) {
      return null
    }

    try {
      const evmBalance = await accountBalance(useNuxtApp().$wagmiConfig, {
        address: address as Address,
        blockTag: 'latest',
        chainId: PREFIX_TO_CHAIN[prefix]?.id,
      })
      console.log('[BALANCE::EVM] Result', evmBalance)

      return BigInt(evmBalance.value).toString()
    }
    catch (error) {
      console.log('[BALANCE::EVM] Error', error)
      return null
    }
  }

  const fetchBalance = (
    address: string, prefix?: Prefix,
  ) => {
    if (!prefix) {
      prefix = urlPrefix.value
    }

    return execByVm({
      SUB: () => getSubBalance(address),
      EVM: () => getEvmBalance(address, prefix),
    })
  }

  return {
    balance,
    getBalance,
    getEvmBalance,
    fetchBalance,
  }
}
