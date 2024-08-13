import { ApiPromise, WsProvider } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { storeToRefs } from 'pinia'
import {
  CHAINS,
  ENDPOINT_MAP,
  type ChainProperties,
  type Prefix,
} from '@kodadot1/static'
import { useIntervalFn } from '@vueuse/core'
import { type Address } from 'viem'
import format from '@/utils/format/balance'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { toDefaultAddress } from '@/utils/account'
import { getNativeBalance } from '@/utils/balance'
import { type ChainType, useIdentityStore } from '@/stores/identity'

export const networkToPrefix: Partial<Record<ChainType, Prefix>> = {
  polkadot: 'dot',
  kusama: 'ksm',
  kusamaHub: 'ahk',
  polkadotHub: 'ahp',
  base: 'base',
  immutablex: 'imx',
  mantle: 'mnt',
  // rococoHub: 'ahr',
}

export const prefixToNetwork: Partial<Record<Prefix, ChainType>> = {
  dot: 'polkadot',
  rmrk: 'kusama',
  ksm: 'kusama',
  ahk: 'kusamaHub',
  ahp: 'polkadotHub',
  base: 'base',
  imx: 'immutablex',
  mnt: 'mantle',
  // ahr: 'rococoHub',
}

const getNetwork = (prefix: Prefix) => {
  return prefixToNetwork[prefix]
}

function calculateUsd(amount: string, tokenValue) {
  if (!amount) {
    return 0
  }

  const amountToNumber = Number(amount.replace(/\,/g, ''))

  return calculateExactUsdFromToken(amountToNumber, Number(tokenValue))
}

export default function (refetchPeriodically: boolean = false) {
  const { accountId } = useAuth()
  const { isTestnet, urlPrefix } = usePrefix()
  const identityStore = useIdentityStore()
  const fiatStore = useFiatStore()
  const { existentialDeposit } = useChain()
  const { getEvmBalance: fetchEvmBalance } = useBalance()

  const {
    multiBalances,
    multiBalanceNetwork,
    getVmAssets: assets,
  } = storeToRefs(identityStore)

  const currentNetwork = computed(() =>
    isTestnet ? 'test-network' : 'main-network',
  )

  const transferableCurrentChainBalance = computed<number | undefined>(() =>
    currentChainBalance.value
      ? Number(currentChainBalance.value) - existentialDeposit.value
      : undefined,
  )

  const chainBalances = computed(() => ({
    [Chain.KUSAMA]: multiBalances.value.chains.kusama?.ksm?.nativeBalance,
    [Chain.ASSETHUBKUSAMA]:
      multiBalances.value.chains.kusamaHub?.ksm?.nativeBalance,
    [Chain.POLKADOT]: multiBalances.value.chains.polkadot?.dot?.nativeBalance,
    [Chain.ASSETHUBPOLKADOT]:
      multiBalances.value.chains.polkadotHub?.dot?.nativeBalance,
    // decouple Chain from teleport
    [Chain.BASE]:
        multiBalances.value.chains.base?.eth?.nativeBalance,
    [Chain.IMMUTABLEX]:
        multiBalances.value.chains.immutablex?.eth?.nativeBalance,
    [Chain.MANTLE]:
        multiBalances.value.chains.mantle?.mnt?.nativeBalance,
  }))

  const currentChain = computed(() => prefixToChainMap[urlPrefix.value])
  const currentChainBalance = computed<string | undefined>(
    () => currentChain.value && chainBalances.value[currentChain.value],
  )
  const hasCurrentChainBalance = computed(
    () => currentChainBalance.value !== undefined,
  )

  async function getSubstrateBalance({
    chain,
    address,
    prefix,
    tokenId,
  }: {
    chain: ChainProperties
    address: string
    prefix: Prefix
    tokenId: number
  }) {
    const publicKey = decodeAddress(address)
    const prefixAddress = encodeAddress(publicKey, chain.ss58Format)
    const wsProvider = new WsProvider(ENDPOINT_MAP[prefix])

    const api = await ApiPromise.create({
      provider: wsProvider,
    })

    const balance = await getNativeBalance({
      address: prefixAddress,
      api: api,
      tokenId,
    })

    await wsProvider.disconnect()

    return { balance: balance.toString(), prefixAddress }
  }

  async function getEvmBalance({
    address,
    prefix,
  }: {
    address: Address
    prefix: Prefix
  }) {
    const balance = await fetchEvmBalance(address, prefix)

    return {
      balance: balance ?? '',
      prefixAddress: address as string,
    }
  }

  async function getBalance(chainName: string, token = 'KSM', tokenId = 0) {
    const currentAddress = accountId.value
    const defaultAddress = execByVm({
      SUB: () => toDefaultAddress(currentAddress),
      EVM: () => currentAddress,
    })

    const prefix = networkToPrefix[chainName]
    const chain = CHAINS[prefix]

    const { balance: nativeBalance, prefixAddress } = (await execByVm({
      SUB: () =>
        getSubstrateBalance({
          address: currentAddress,
          prefix,
          chain,
          tokenId,
        }),
      EVM: () => getEvmBalance({ address: currentAddress as Address, prefix }),
    })) as { balance: string, prefixAddress: string }

    const currentBalance = format(nativeBalance, chain.tokenDecimals, false)
    const selectedTokenId = String(tokenId)

    const usd = calculateUsd(
      currentBalance,
      fiatStore.getCurrentTokenValue(token),
    )

    identityStore.setMultiBalances({
      address: defaultAddress,
      chains: {
        [chainName]: {
          [token.toLowerCase()]: {
            address: prefixAddress,
            balance: currentBalance,
            nativeBalance,
            usd,
            selected: selectedTokenId === String(tokenId),
          },
        },
      },
      chainName,
    })

    identityStore.setBalance(prefix, nativeBalance)
    identityStore.multiBalanceNetwork = currentNetwork.value

    return Promise.resolve()
  }

  const fetchFiatPrice = async (force: boolean) => {
    if (!force && fiatStore.incompleteFiatValues) {
      await fiatStore.fetchFiatPrice()
    }
  }

  const fetchMultipleBalance = async (
    onlyPrefixes: Prefix[] = [],
    forceFiat: boolean = false,
  ) => {
    await fetchFiatPrice(forceFiat)

    if (!accountId.value) {
      return
    }

    const chainNetworks = onlyPrefixes.map(getNetwork).filter(Boolean)

    const assetsToFetch = onlyPrefixes.length
      ? assets.value.filter(item => chainNetworks.includes(item.chain))
      : assets.value

    const promisses = assetsToFetch.map(item =>
      getBalance(item.chain, item.token, Number(item.tokenId)),
    )

    return Promise.allSettled(promisses)
  }

  onMounted(async () => {
    if (
      currentNetwork.value !== multiBalanceNetwork.value
      && refetchPeriodically
    ) {
      identityStore.resetMultipleBalances()
    }
  })

  const { pause: clearInterval } = useIntervalFn(
    () => {
      fetchMultipleBalance()
    },
    30000,
    { immediate: refetchPeriodically, immediateCallback: refetchPeriodically },
  )

  onUnmounted(() => {
    clearInterval()
  })

  return {
    multiBalances,
    chainBalances,
    currentNetwork,
    currentChainBalance,
    hasCurrentChainBalance,
    fetchMultipleBalance,
    transferableCurrentChainBalance,
  }
}
