import {
  type Chain,
  type TeleportChain,
  type TeleportTransition,
  chainToPrefixMap,
  prefixToChainMap,
} from '@/utils/teleport'
import useAutoTeleportTransitionDetails from '@/composables/autoTeleport/useAutoTeleportTransitionDetails'
import type { AutoTeleportAction, AutoTeleportFeeParams } from './types'

export default function ({
  actions,
  neededAmount,
  autoTeleportStarted,
  fees,
}: {
  actions: ComputedRef<AutoTeleportAction[]>
  neededAmount: ComputedRef<number>
  autoTeleportStarted: Ref<boolean>
  fees: AutoTeleportFeeParams
}) {
  const { urlPrefix } = usePrefix()
  const { isAvailable, getChainTokenDecimals } = useTeleport()

  const {
    amountToTeleport,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    sourceChain,
    chainSymbol,
    txFees,
    isReady,
  } = useAutoTeleportTransitionDetails(actions, neededAmount, fees)

  const { formatted: amountFormatted, usd: amountUsd } = useAmount(
    amountToTeleport,
    computed(() => Number(getChainTokenDecimals(sourceChain.value as Chain))),
    chainSymbol as ComputedRef<string>,
  )

  const optimalTransition =
    ref<TeleportTransition>(emptyObject<TeleportTransition>())

  watchSyncEffect(() => {
    if (autoTeleportStarted.value) {
      return
    }

    let source: TeleportChain | null = null

    if (hasEnoughInRichestChain.value && sourceChain.value && isReady.value) {
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
      txFees: txFees.value,
    }
  })

  return {
    isAvailable,
    isReady,
    hasEnoughInCurrentChain,
    hasEnoughInRichestChain,
    optimalTransition,
  }
}
