import {
  type Chain,
  type TeleportChain,
  type TeleportTransition,
  chainToPrefixMap,
  prefixToChainMap,
} from '@/utils/teleport'
import useAutoTeleportTransitionSource from '@/composables/autoTeleport/useAutoTeleportTransitionSource'

export default function (neededAmount: ComputedRef<number>) {
  const { urlPrefix } = usePrefix()
  const { isAvailable, getChainTokenDecimals } = useTeleport()

  const {
    amountToTeleport,
    hasBalances,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    sourceChain,
    chainSymbol,
  } = useAutoTeleportTransitionSource(neededAmount)

  const { formatted: amountFormatted, usd: amountUsd } = useAmount(
    amountToTeleport,
    computed(() => Number(getChainTokenDecimals(sourceChain.value as Chain))),
    chainSymbol as ComputedRef<string>,
  )

  const optimalTransition = ref<TeleportTransition>(
    emptyObject<TeleportTransition>(),
  )

  watchSyncEffect(() => {
    if (hasEnoughInCurrentChain.value) {
      return
    }

    let source: TeleportChain | null = null

    if (hasEnoughInRichestChain.value && sourceChain.value) {
      source = {
        chain: sourceChain.value,
        prefix: chainToPrefixMap[sourceChain.value],
        name: getChainName(chainToPrefixMap[sourceChain.value]),
      }
    }

    optimalTransition.value = {
      source: source,
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

  return {
    isAvailable,
    hasBalances,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
  }
}
