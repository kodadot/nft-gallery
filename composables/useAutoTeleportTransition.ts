import {
  type Chain,
  type TeleportChain,
  type TeleportTransition,
  chainToPrefixMap,
  prefixToChainMap,
} from '@/utils/teleport'
import { Actions } from '@/composables/transaction/types'
import useAutoTeleportTransitionSource from './autoTeleport/useAutoTeleportTransitionSource'

export default function (action: Actions, neededAmount: ComputedRef<number>) {
  const { urlPrefix } = usePrefix()
  const { isAvailable, getChainTokenDecimals } = useTeleport()

  const {
    amountToTeleport,
    hasEnoughInCurrentChain,
    sourceChain,
    chainSymbol,
    hasEnoughInRichestChain,
  } = useAutoTeleportTransitionSource(action, neededAmount)

  const { formatted: amountFormatted, usd: amountUsd } = useAmount(
    amountToTeleport,
    computed(() => Number(getChainTokenDecimals(sourceChain.value as Chain))),
    chainSymbol as ComputedRef<string>,
  )

  const optimalTransition = computed<TeleportTransition>(() => {
    let source: TeleportChain | null = null

    if (hasEnoughInRichestChain.value) {
      const name = sourceChain.value
        ? getChainName(chainToPrefixMap[sourceChain.value])
        : ''
      source = {
        chain: sourceChain.value,
        prefix: chainToPrefixMap[sourceChain.value],
        name,
      }
    }

    return {
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
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
  }
}
