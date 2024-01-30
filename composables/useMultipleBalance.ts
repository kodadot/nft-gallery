import { ApiPromise, WsProvider } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import format from '@/utils/format/balance'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { toDefaultAddress } from '@/utils/account'

import { storeToRefs } from 'pinia'
import { CHAINS, ENDPOINT_MAP, Prefix } from '@kodadot1/static'
import { getNativeBalance } from '@/utils/balance'
import { useIntervalFn } from '@vueuse/core'
import { useIdentityStore } from '@/stores/identity'

const networkToPrefix = {
  polkadot: 'dot',
  kusama: 'ksm',
  kusamaHub: 'ahk',
  polkadotHub: 'ahp',
  // rococoHub: 'ahr',
}

export const prefixToNetwork = {
  dot: 'polkadot',
  rmrk: 'kusama',
  ksm: 'kusama',
  ahk: 'kusamaHub',
  ahp: 'polkadotHub',
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

  const {
    multiBalances,
    multiBalanceAssets,
    multiBalanceAssetsTestnet,
    multiBalanceNetwork,
  } = storeToRefs(identityStore)

  const currentNetwork = computed(() =>
    isTestnet ? 'test-network' : 'main-network',
  )

  const chainBalances = computed(() => ({
    [Chain.KUSAMA]: multiBalances.value.chains.kusama?.ksm?.nativeBalance,
    [Chain.ASSETHUBKUSAMA]:
      multiBalances.value.chains.kusamaHub?.ksm?.nativeBalance,
    [Chain.POLKADOT]: multiBalances.value.chains.polkadot?.dot?.nativeBalance,
    [Chain.ASSETHUBPOLKADOT]:
      multiBalances.value.chains.polkadotHub?.dot?.nativeBalance,
  }))

  const currentChain = computed(() => prefixToChainMap[urlPrefix.value])
  const currentChainBalance = computed<string | undefined>(
    () => currentChain.value && chainBalances.value[currentChain.value],
  )
  const hasCurrentChainBalance = computed(
    () => currentChainBalance.value !== undefined,
  )

  async function getBalance(chainName: string, token = 'KSM', tokenId = 0) {
    const currentAddress = accountId.value
    const prefix = networkToPrefix[chainName]
    const chain = CHAINS[prefix]

    const defaultAddress = toDefaultAddress(currentAddress)
    const publicKey = decodeAddress(currentAddress)
    const prefixAddress = encodeAddress(publicKey, chain.ss58Format)
    const wsProvider = new WsProvider(ENDPOINT_MAP[prefix])

    const api = await ApiPromise.create({
      provider: wsProvider,
    })

    const nativeBalance = await getNativeBalance({
      address: prefixAddress,
      api: api,
      tokenId,
    })

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

    identityStore.setBalance(prefix, currentBalance)

    identityStore.multiBalanceNetwork = currentNetwork.value

    return wsProvider.disconnect()
  }

  const fetchFiatPrice = async (force) => {
    if (!force && fiatStore.incompleteFiatValues) {
      await fiatStore.fetchFiatPrice()
    }
  }

  const fetchMultipleBalance = async (
    onlyPrefixes: Prefix[] = [],
    forceFiat: boolean = false,
  ) => {
    await fetchFiatPrice(forceFiat)

    const assets = isTestnet
      ? multiBalanceAssetsTestnet.value
      : multiBalanceAssets.value

    const chainNetworks = onlyPrefixes.map(getNetwork).filter(Boolean)

    const assetsToFetch = onlyPrefixes.length
      ? assets.filter((item) => chainNetworks.includes(item.chain))
      : assets

    const promisses = assetsToFetch.map((item) =>
      getBalance(item.chain, item.token, Number(item.tokenId)),
    )

    return Promise.allSettled(promisses)
  }

  onMounted(async () => {
    if (
      currentNetwork.value !== multiBalanceNetwork.value &&
      refetchPeriodically
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
  }
}
