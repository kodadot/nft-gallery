import { ApiPromise, WsProvider } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS, ENDPOINT_MAP } from '@kodadot1/static'
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

const fetchMultipleBalance = async (currentNetwork) => {
  const fiatStore = useFiatStore()
  const identityStore = useIdentityStore()

  const { isTestnet } = usePrefix()
  const { multiBalanceAssets, multiBalanceAssetsTestnet } =
    storeToRefs(identityStore)

  await fiatStore.fetchFiatPrice()
  const assets = isTestnet.value
    ? multiBalanceAssetsTestnet.value
    : multiBalanceAssets.value

  await Promise.all(
    assets.map(async (item) => {
      identityStore.setMultiBalances(
        await getBalance(item.chain, item.token, Number(item.tokenId)),
      )
      identityStore.multiBalanceNetwork = currentNetwork.value
    }),
  )
}

export default function () {
  const { isTestnet } = usePrefix()
  const refetchMultipleBalanceTimer = ref()
  const identityStore = useIdentityStore()

  const { multiBalances, multiBalanceNetwork } = storeToRefs(identityStore)

  const currentNetwork = computed(() =>
    isTestnet.value ? 'test-network' : 'main-network',
  )

  onMounted(async () => {
    if (currentNetwork.value !== multiBalanceNetwork.value) {
      identityStore.resetMultipleBalances()
    }

    fetchMultipleBalance(currentNetwork)
    refetchMultipleBalanceTimer.value = setInterval(() => {
      fetchMultipleBalance(currentNetwork)
    }, 30000)
  })

  onBeforeUnmount(() => {
    clearInterval(refetchMultipleBalanceTimer.value)
  })

  return {
    multiBalances,
  }
}
