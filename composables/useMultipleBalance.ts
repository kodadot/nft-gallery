import { ApiPromise, WsProvider } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS, ENDPOINT_MAP, Prefix } from '@kodadot1/static'
import { balanceOf } from '@kodadot1/sub-api'
import format from '@/utils/format/balance'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { toDefaultAddress } from '@/utils/account'

import { useIdentityStore } from '@/stores/identity'
import type { PalletBalancesAccountData } from '@polkadot/types/lookup'

const networkToPrefix = {
  polkadot: 'dot',
  kusama: 'ksm',
  basilisk: 'bsx',
  kusamaHub: 'ahk',
  'basilisk-testnet': 'snek',
  polkadotHub: 'ahp',
}

export const prefixToNetwork = {
  dot: 'polkadot',
  rmrk: 'kusama',
  ksm: 'kusama',
  bsx: 'basilisk',
  ahk: 'kusamaHub',
  snek: 'basilisk-testnet',
  ahp: 'polkadotHub',
}

const getNetwork = (prefix: Prefix) => {
  return prefixToNetwork[prefix]
}

const calculateUsd = (amount: string, token = 'KSM') => {
  const fiatStore = useFiatStore()

  if (!amount) {
    return 0
  }

  const amountToNumber = Number(amount.replace(/\,/g, ''))

  return calculateExactUsdFromToken(
    amountToNumber,
    Number(fiatStore.getCurrentTokenValue(token)),
  )
}

const getCombinedBalances = async (chainName, tokenId, prefixAddress) => {
  const prefix = networkToPrefix[chainName]
  const chain = CHAINS[prefix]

  const wsProvider = new WsProvider(ENDPOINT_MAP[prefix])
  const api = await ApiPromise.create({
    provider: wsProvider,
  })

  const nativeBalance = tokenId
    ? (
        (await api.query.tokens.accounts(
          prefixAddress,
          tokenId,
        )) as PalletBalancesAccountData
      ).free.toString()
    : await balanceOf(api, prefixAddress)
  const currentBalance = format(nativeBalance, chain.tokenDecimals, false)
  await wsProvider.disconnect()

  return { nativeBalance, currentBalance }
}

const getBalance = async (chainName: string, token = 'KSM', tokenId = 0) => {
  const { accountId } = useAuth()

  const currentAddress = accountId.value
  const prefix = networkToPrefix[chainName]
  const chain = CHAINS[prefix]

  const defaultAddress = toDefaultAddress(currentAddress)
  const publicKey = decodeAddress(currentAddress)
  const prefixAddress = encodeAddress(publicKey, chain.ss58Format)

  const balances = await getCombinedBalances(chainName, tokenId, prefixAddress)

  return {
    address: defaultAddress,
    chains: {
      [chainName]: {
        [token.toLowerCase()]: {
          address: prefixAddress,
          balance: balances.currentBalance,
          nativeBalance: balances.currentBalance,
          usd: calculateUsd(balances.currentBalance, token),
          selected: chainName === 'basilisk',
        },
      },
    },
    chainName,
  }
}

const fetchFiatPrice = async (force) => {
  const fiatStore = useFiatStore()
  if (!force && fiatStore.incompleteFiatValues) {
    await fiatStore.fetchFiatPrice()
  }
}

const fetchMultipleBalance = async (
  currentNetwork,
  onlyPrefixes: Prefix[] = [],
  forceFiat: boolean = false,
) => {
  const { isTestnet } = usePrefix()
  const identityStore = useIdentityStore()
  const { multiBalanceAssets, multiBalanceAssetsTestnet } =
    storeToRefs(identityStore)

  await fetchFiatPrice(forceFiat)
  const assets = isTestnet.value
    ? multiBalanceAssetsTestnet.value
    : multiBalanceAssets.value

  const chainNetworks = onlyPrefixes.map(getNetwork).filter(Boolean)

  const assetsToFetch = onlyPrefixes.length
    ? assets.filter((item) => chainNetworks.includes(item.chain))
    : assets

  await Promise.allSettled(
    assetsToFetch.map(async (item) => {
      identityStore.setMultiBalances(
        await getBalance(item.chain, item.token, Number(item.tokenId)),
      )
      identityStore.multiBalanceNetwork = currentNetwork.value
    }),
  )
}

export default function (refetchPeriodically: boolean = false) {
  const { isTestnet } = usePrefix()
  const identityStore = useIdentityStore()
  const { multiBalances, multiBalanceNetwork } = storeToRefs(identityStore)

  const currNet = computed(() => `${isTestnet.value ? 'test' : 'main'}-network`)

  onMounted(() => {
    if (currNet.value !== multiBalanceNetwork.value && refetchPeriodically) {
      identityStore.resetMultipleBalances()
    }
  })

  const { pause: clearInterval } = useIntervalFn(
    () => {
      fetchMultipleBalance(currNet)
    },
    30000,
    {
      immediate: refetchPeriodically,
      immediateCallback: refetchPeriodically,
    },
  )

  onUnmounted(clearInterval)

  return {
    multiBalances,
    currentNetwork: currNet,
    fetchMultipleBalance,
  }
}
