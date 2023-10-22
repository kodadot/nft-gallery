import {
  type Chain,
  TeleportTransition,
  chainToPrefixMap,
  getChainCurrency,
  prefixToChainMap,
  allowedTransitions as teleportRoutes,
} from '@/utils/teleport'
import { CHAINS, type Prefix } from '@kodadot1/static'
import { max } from 'lodash'
import { Actions } from '@/composables/transaction/types'

export default function (action: Actions, neededAmount: ComputedRef<number>) {
  const { urlPrefix } = usePrefix()
  const {
    chainBalances,
    canTeleport,
    chain: currentChain,
    getTransactionFee,
    getAddressByChain,
  } = useTeleport()
  const { fetchMultipleBalance } = useMultiBalance()

  const teleportTxFee = ref(0)

  const hasEnoughInCurrentChain = computed(
    () => neededAmount.value < Number(currentChainBalance.value),
  )
  const chainSymbol = computed(
    () => currentChain.value && getChainCurrency(currentChain.value),
  )
  const targetChains = computed(() =>
    currentChain.value ? teleportRoutes[currentChain.value] : [],
  )

  const currentChainBalance = computed(
    () => currentChain.value && Number(chainBalances[currentChain.value]()),
  )
  const sourceChainsBalances = computed<{ [key: Chain]: string }>(() =>
    targetChains.value.reduce(
      (reducer, chainPrefix) => ({
        ...reducer,
        [chainPrefix]: chainBalances[chainPrefix](),
      }),
      {},
    ),
  )

  const richestChain = computed<Chain | undefined>(() =>
    max(
      Object.keys(sourceChainsBalances.value),
      (o: Prefix) => sourceChainsBalances.value[o],
    ),
  )
  const richestChainBalance = computed(() =>
    richestChain.value
      ? Number(sourceChainsBalances.value[richestChain.value])
      : 0,
  )
  const sourceChain = computed(
    () => richestChain.value && CHAINS[chainToPrefixMap[richestChain.value]],
  )

  const fees = computed(() => teleportTxFee.value)

  const amountToTeleport = computed(
    () => neededAmount.value + fees.value - Number(currentChainBalance.value),
  )
  const hasEnoughInRichestChain = computed(() => {
    const total =
      currentChainBalance.value || 0 + richestChainBalance.value || 0
    return total > amountToTeleport.value
  })

  const { formatted: amountFormatted, usd: amountUsd } = useAmount(
    amountToTeleport,
    computed(() => Number(sourceChain.value?.tokenDecimals)),
    chainSymbol as ComputedRef<string>,
  )

  const optimalTransition = computed<TeleportTransition>(() => {
    return {
      source: richestChain.value
        ? {
            chain: richestChain.value,
            prefix: chainToPrefixMap[richestChain.value],
            name: richestChain.value
              ? getChainName(chainToPrefixMap[richestChain.value])
              : '',
            txFee: teleportTxFee.value,
          }
        : null,
      destination: {
        chain: prefixToChainMap[urlPrefix.value] as Chain,
        prefix: urlPrefix.value,
        name: getChainName(urlPrefix.value),
      },
      amount: amountToTeleport.value,
      amountFormatted: amountFormatted.value,
      amountUsd: amountUsd.value,
      token: chainSymbol.value as string,
    }
  })

  const getTeleportTransactionFee = async () => {
    const {
      amount,
      destination,
      token: currency,
      source,
    } = optimalTransition.value

    if (!source) {
      return 0
    }

    return await getTransactionFee({
      amount,
      from: source.chain,
      fromAddress: getAddressByChain(source.chain),
      to: destination.chain,
      toAddress: getAddressByChain(destination.chain),
      currency: currency,
    })
  }

  watch(
    () => optimalTransition.value.source,
    async (source) => {
      if (source) {
        const fee = await getTeleportTransactionFee()
        teleportTxFee.value = Number(fee || 0)
      }
    },
  )

  onMounted(async () => {
    await fetchMultipleBalance()
  })

  return {
    canTeleport,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
  }
}
