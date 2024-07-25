import { balanceOf } from '@kodadot1/sub-api'
import type { Prefix } from '@kodadot1/static'
import type { Address } from 'viem'
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
    } catch (e) {
      return null
    }
  }

  const getEvmBalance = async (address: string, prefix: Prefix) => {
    try {
      const response = await useViem(prefix).publicClient.getBalance({
        address: address as Address,
      })
      return response.toString()
    } catch (error) {
      return null
    }
  }

  const fetchBalance = (
    address: string,
    prefix?: Prefix,
  ): Promise<string | null> => {
    if (!prefix) {
      prefix = urlPrefix.value
    }

    return execByVm({
      SUB: () => getSubBalance(address),
      EVM: () => getEvmBalance(address, prefix),
    }) as Promise<string | null>
  }

  return {
    balance,
    getBalance,
    getEvmBalance,
    fetchBalance,
  }
}
