import { ApiPromise, WsProvider } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS, ENDPOINT_MAP } from '@kodadot1/static'
import { balanceOf } from '@kodadot1/sub-api'
import format from '@/utils/format/balance'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { getAssetIdByAccount } from '@/utils/api/bsx/query'
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

export default function () {
  const { accountId } = useAuth()
  const { isTestnet } = usePrefix()
  const refetchMultipleBalanceTimer = ref()
  const identityStore = useIdentityStore()
  const fiatStore = useFiatStore()

  const {
    multiBalances,
    multiBalanceAssets,
    multiBalanceAssetsTestnet,
    multiBalanceNetwork,
  } = storeToRefs(identityStore)

  const currentNetwork = computed(() =>
    isTestnet.value ? 'test-network' : 'main-network',
  )
  function calculateUsd(amount: string, token = 'KSM') {
    if (!amount) {
      return 0
    }

    const amountToNumber = Number(amount.replace(/\,/g, ''))

    return calculateExactUsdFromToken(
      amountToNumber,
      Number(fiatStore.getCurrentTokenValue(token)),
    )
  }

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

    let currentBalance
    let nativeBalance

    if (tokenId) {
      nativeBalance = (
        (await api.query.tokens.accounts(
          prefixAddress,
          tokenId,
        )) as PalletBalancesAccountData
      ).free.toString()
      currentBalance = format(nativeBalance, chain.tokenDecimals, false)
    } else {
      nativeBalance = await balanceOf(api, prefixAddress)
      currentBalance = format(nativeBalance, chain.tokenDecimals, false)
    }

    let selectedTokenId = String(tokenId)
    if (chainName === 'basilisk') {
      selectedTokenId = await getAssetIdByAccount(api, prefixAddress)
    }

    const usd = calculateUsd(currentBalance, token)

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

    identityStore.multiBalanceNetwork = currentNetwork.value

    await wsProvider.disconnect()
  }

  const fetchMultipleBalance = async () => {
    await fiatStore.fetchFiatPrice()
    const assets = isTestnet.value
      ? multiBalanceAssetsTestnet.value
      : multiBalanceAssets.value

    assets.forEach((item) => {
      getBalance(item.chain, item.token, Number(item.tokenId))
    })
  }

  onMounted(async () => {
    if (currentNetwork.value !== multiBalanceNetwork.value) {
      identityStore.resetMultipleBalances()
    }

    fetchMultipleBalance()
    refetchMultipleBalanceTimer.value = setInterval(() => {
      fetchMultipleBalance()
    }, 30000)
  })

  onBeforeUnmount(() => {
    clearInterval(refetchMultipleBalanceTimer.value)
  })

  return {
    multiBalances,
  }
}
