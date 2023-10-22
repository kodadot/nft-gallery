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

export default function (neededAmount: ComputedRef<number>) {
  const { urlPrefix } = usePrefix()
  const { chainBalances, canTeleport, chain: currentChain } = useTeleport()
  const { fetchMultipleBalance } = useMultiBalance()

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
  const amountToTeleport = computed(
    () => neededAmount.value - Number(currentChainBalance.value),
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
